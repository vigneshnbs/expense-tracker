package com.example.expensetracker.service;

import com.example.expensetracker.dto.MonthlySpendingDTO;
import com.example.expensetracker.dto.TransferRequest;
import com.example.expensetracker.enums.TransactionType;
import com.example.expensetracker.model.Account;
import com.example.expensetracker.model.Category;
import com.example.expensetracker.model.Transaction;
import com.example.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for Transaction operations
 */
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountService accountService;
    private final CategoryService categoryService;

    /**
     * Get all transactions
     */
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    /**
     * Get transaction by ID
     */
    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    /**
     * Get transactions by account ID
     */
    public List<Transaction> getTransactionsByAccount(Long accountId) {
        return transactionRepository.findByAccountId(accountId);
    }

    /**
     * Get transactions by category ID
     */
    public List<Transaction> getTransactionsByCategory(Long categoryId) {
        return transactionRepository.findByCategoryId(categoryId);
    }

    /**
     * Get transactions within date range
     */
    public List<Transaction> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByTransactionDateBetween(startDate, endDate);
    }

    /**
     * Create new transaction and update account balance
     */
    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        // Validate account exists
        Account account = accountService.getAccountById(transaction.getAccountId());

        // Validate category exists
        if (!categoryService.categoryExists(transaction.getCategoryId())) {
            throw new RuntimeException("Category not found with id: " + transaction.getCategoryId());
        }

        // Save transaction
        Transaction savedTransaction = transactionRepository.save(transaction);

        // Update account balance based on transaction type
        updateAccountBalanceForTransaction(account, transaction);

        return savedTransaction;
    }

    /**
     * Update existing transaction
     */
    @Transactional
    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        Transaction existingTransaction = getTransactionById(id);
        Account account = accountService.getAccountById(existingTransaction.getAccountId());

        // Reverse the effect of the old transaction
        reverseAccountBalanceForTransaction(account, existingTransaction);

        // Update transaction details
        existingTransaction.setAccountId(transactionDetails.getAccountId());
        existingTransaction.setCategoryId(transactionDetails.getCategoryId());
        existingTransaction.setAmount(transactionDetails.getAmount());
        existingTransaction.setTransactionType(transactionDetails.getTransactionType());
        existingTransaction.setTransactionDate(transactionDetails.getTransactionDate());
        existingTransaction.setDescription(transactionDetails.getDescription());
        existingTransaction.setNotes(transactionDetails.getNotes());

        Transaction updatedTransaction = transactionRepository.save(existingTransaction);

        // Apply the new transaction effect
        Account newAccount = accountService.getAccountById(transactionDetails.getAccountId());
        updateAccountBalanceForTransaction(newAccount, updatedTransaction);

        return updatedTransaction;
    }

    /**
     * Delete transaction
     */
    @Transactional
    public void deleteTransaction(Long id) {
        Transaction transaction = getTransactionById(id);
        Account account = accountService.getAccountById(transaction.getAccountId());

        // Reverse the transaction effect on account balance
        reverseAccountBalanceForTransaction(account, transaction);

        transactionRepository.deleteById(id);
    }

    /**
     * Handle transfer between accounts
     * Creates two linked transactions with the same transfer_reference_id
     */
    @Transactional
    public List<Transaction> createTransfer(TransferRequest transferRequest) {
        // Validate accounts exist
        Account fromAccount = accountService.getAccountById(transferRequest.getFromAccountId());
        Account toAccount = accountService.getAccountById(transferRequest.getToAccountId());

        // Check sufficient balance in from account
        if (fromAccount.getCurrentBalance().compareTo(transferRequest.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance in source account");
        }

        // Generate unique transfer reference ID
        String transferReferenceId = UUID.randomUUID().toString();

        // Create outgoing transaction (debit from source account)
        Transaction outgoingTransaction = new Transaction();
        outgoingTransaction.setAccountId(transferRequest.getFromAccountId());
        outgoingTransaction.setCategoryId(transferRequest.getCategoryId());
        outgoingTransaction.setAmount(transferRequest.getAmount());
        outgoingTransaction.setTransactionType(TransactionType.TRANSFER);
        outgoingTransaction.setTransactionDate(transferRequest.getTransactionDate());
        outgoingTransaction.setDescription(transferRequest.getDescription() + " (Transfer Out)");
        outgoingTransaction.setNotes(transferRequest.getNotes());
        outgoingTransaction.setTransferReferenceId(transferReferenceId);

        // Create incoming transaction (credit to destination account)
        Transaction incomingTransaction = new Transaction();
        incomingTransaction.setAccountId(transferRequest.getToAccountId());
        incomingTransaction.setCategoryId(transferRequest.getCategoryId());
        incomingTransaction.setAmount(transferRequest.getAmount());
        incomingTransaction.setTransactionType(TransactionType.TRANSFER);
        incomingTransaction.setTransactionDate(transferRequest.getTransactionDate());
        incomingTransaction.setDescription(transferRequest.getDescription() + " (Transfer In)");
        incomingTransaction.setNotes(transferRequest.getNotes());
        incomingTransaction.setTransferReferenceId(transferReferenceId);

        // Save both transactions
        Transaction savedOutgoing = transactionRepository.save(outgoingTransaction);
        Transaction savedIncoming = transactionRepository.save(incomingTransaction);

        // Update account balances
        fromAccount.setCurrentBalance(fromAccount.getCurrentBalance().subtract(transferRequest.getAmount()));
        accountService.updateAccountBalance(fromAccount.getId(), fromAccount.getCurrentBalance());

        toAccount.setCurrentBalance(toAccount.getCurrentBalance().add(transferRequest.getAmount()));
        accountService.updateAccountBalance(toAccount.getId(), toAccount.getCurrentBalance());

        List<Transaction> transferTransactions = new ArrayList<>();
        transferTransactions.add(savedOutgoing);
        transferTransactions.add(savedIncoming);

        return transferTransactions;
    }

    /**
     * Get monthly spending by category for current month
     */
    public List<MonthlySpendingDTO> getMonthlySpendingByCategory() {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();

        return getMonthlySpendingByCategory(startDate, endDate);
    }

    /**
     * Get monthly spending by category for specified date range
     */
    public List<MonthlySpendingDTO> getMonthlySpendingByCategory(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = transactionRepository.getMonthlySpendingByCategory(
            TransactionType.EXPENSE, startDate, endDate
        );

        List<MonthlySpendingDTO> spendingList = new ArrayList<>();
        for (Object[] result : results) {
            Long categoryId = (Long) result[0];
            BigDecimal totalSpent = (BigDecimal) result[1];

            Category category = categoryService.getCategoryById(categoryId);

            MonthlySpendingDTO dto = new MonthlySpendingDTO();
            dto.setCategoryId(categoryId);
            dto.setCategoryName(category.getName());
            dto.setTotalSpent(totalSpent);

            spendingList.add(dto);
        }

        return spendingList;
    }

    /**
     * Update account balance based on transaction type
     */
    private void updateAccountBalanceForTransaction(Account account, Transaction transaction) {
        BigDecimal newBalance = account.getCurrentBalance();

        switch (transaction.getTransactionType()) {
            case INCOME:
                newBalance = newBalance.add(transaction.getAmount());
                break;
            case EXPENSE:
                newBalance = newBalance.subtract(transaction.getAmount());
                break;
            case TRANSFER:
                // Transfers are handled separately in createTransfer method
                return;
        }

        accountService.updateAccountBalance(account.getId(), newBalance);
    }

    /**
     * Reverse the effect of a transaction on account balance
     */
    private void reverseAccountBalanceForTransaction(Account account, Transaction transaction) {
        BigDecimal newBalance = account.getCurrentBalance();

        switch (transaction.getTransactionType()) {
            case INCOME:
                newBalance = newBalance.subtract(transaction.getAmount());
                break;
            case EXPENSE:
                newBalance = newBalance.add(transaction.getAmount());
                break;
            case TRANSFER:
                // Transfers should be deleted via special method
                return;
        }

        accountService.updateAccountBalance(account.getId(), newBalance);
    }
}