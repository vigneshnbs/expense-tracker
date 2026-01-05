package com.example.expensetracker.service;

import com.example.expensetracker.enums.AccountType;
import com.example.expensetracker.model.Account;
import com.example.expensetracker.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service layer for Account operations
 */
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    /**
     * Get all accounts
     */
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    /**
     * Get all active accounts
     */
    public List<Account> getActiveAccounts() {
        return accountRepository.findByIsActiveTrue();
    }

    /**
     * Get account by ID
     */
    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    /**
     * Get accounts by type
     */
    public List<Account> getAccountsByType(AccountType accountType) {
        return accountRepository.findByAccountType(accountType);
    }

    /**
     * Create new account
     */
    @Transactional
    public Account createAccount(Account account) {
        if (account.getCurrentBalance() == null) {
            account.setCurrentBalance(BigDecimal.ZERO);
        }
        if (account.getIsActive() == null) {
            account.setIsActive(true);
        }
        return accountRepository.save(account);
    }

    /**
     * Update existing account
     */
    @Transactional
    public Account updateAccount(Long id, Account accountDetails) {
        Account account = getAccountById(id);

        account.setAccountName(accountDetails.getAccountName());
        account.setAccountType(accountDetails.getAccountType());
        account.setCurrentBalance(accountDetails.getCurrentBalance());
        account.setIsActive(accountDetails.getIsActive());

        return accountRepository.save(account);
    }

    /**
     * Update account balance
     */
    @Transactional
    public Account updateAccountBalance(Long id, BigDecimal newBalance) {
        Account account = getAccountById(id);
        account.setCurrentBalance(newBalance);
        return accountRepository.save(account);
    }

    /**
     * Deactivate account (soft delete)
     */
    @Transactional
    public void deactivateAccount(Long id) {
        Account account = getAccountById(id);
        account.setIsActive(false);
        accountRepository.save(account);
    }

    /**
     * Delete account permanently
     */
    @Transactional
    public void deleteAccount(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new RuntimeException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
    }

    /**
     * Calculate total balance across all active accounts
     */
    public BigDecimal calculateTotalBalance() {
        return accountRepository.findByIsActiveTrue().stream()
            .map(Account::getCurrentBalance)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}