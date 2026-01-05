package com.example.expensetracker.controller;

import com.example.expensetracker.dto.MonthlySpendingDTO;
import com.example.expensetracker.dto.TransferRequest;
import com.example.expensetracker.model.Transaction;
import com.example.expensetracker.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Transaction operations
 */
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * GET /api/transactions - Get all transactions
     */
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/transactions/{id} - Get transaction by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Transaction transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }

    /**
     * GET /api/transactions/account/{accountId} - Get transactions by account
     */
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccount(@PathVariable Long accountId) {
        List<Transaction> transactions = transactionService.getTransactionsByAccount(accountId);
        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/transactions/category/{categoryId} - Get transactions by category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Transaction>> getTransactionsByCategory(@PathVariable Long categoryId) {
        List<Transaction> transactions = transactionService.getTransactionsByCategory(categoryId);
        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/transactions/date-range - Get transactions within date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<Transaction>> getTransactionsByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<Transaction> transactions = transactionService.getTransactionsByDateRange(startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    /**
     * POST /api/transactions - Create new transaction
     */
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) {
        Transaction createdTransaction = transactionService.createTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }

    /**
     * PUT /api/transactions/{id} - Update transaction
     */
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
        @PathVariable Long id,
        @Valid @RequestBody Transaction transaction
    ) {
        Transaction updatedTransaction = transactionService.updateTransaction(id, transaction);
        return ResponseEntity.ok(updatedTransaction);
    }

    /**
     * DELETE /api/transactions/{id} - Delete transaction
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/transactions/transfer - Create transfer between accounts
     */
    @PostMapping("/transfer")
    public ResponseEntity<List<Transaction>> createTransfer(@Valid @RequestBody TransferRequest transferRequest) {
        List<Transaction> transferTransactions = transactionService.createTransfer(transferRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(transferTransactions);
    }

    /**
     * GET /api/transactions/monthly-spending - Get monthly spending by category for current month
     */
    @GetMapping("/monthly-spending")
    public ResponseEntity<List<MonthlySpendingDTO>> getMonthlySpending() {
        List<MonthlySpendingDTO> monthlySpending = transactionService.getMonthlySpendingByCategory();
        return ResponseEntity.ok(monthlySpending);
    }

    /**
     * GET /api/transactions/monthly-spending/date-range - Get monthly spending by category for date range
     */
    @GetMapping("/monthly-spending/date-range")
    public ResponseEntity<List<MonthlySpendingDTO>> getMonthlySpendingByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<MonthlySpendingDTO> monthlySpending = transactionService.getMonthlySpendingByCategory(startDate, endDate);
        return ResponseEntity.ok(monthlySpending);
    }
}