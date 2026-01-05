package com.example.expensetracker.controller;

import com.example.expensetracker.enums.AccountType;
import com.example.expensetracker.model.Account;
import com.example.expensetracker.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for Account operations
 */
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    /**
     * GET /api/accounts - Get all accounts
     */
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    /**
     * GET /api/accounts/active - Get all active accounts
     */
    @GetMapping("/active")
    public ResponseEntity<List<Account>> getActiveAccounts() {
        List<Account> accounts = accountService.getActiveAccounts();
        return ResponseEntity.ok(accounts);
    }

    /**
     * GET /api/accounts/{id} - Get account by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        Account account = accountService.getAccountById(id);
        return ResponseEntity.ok(account);
    }

    /**
     * GET /api/accounts/type/{accountType} - Get accounts by type
     */
    @GetMapping("/type/{accountType}")
    public ResponseEntity<List<Account>> getAccountsByType(@PathVariable AccountType accountType) {
        List<Account> accounts = accountService.getAccountsByType(accountType);
        return ResponseEntity.ok(accounts);
    }

    /**
     * POST /api/accounts - Create new account
     */
    @PostMapping
    public ResponseEntity<Account> createAccount(@Valid @RequestBody Account account) {
        Account createdAccount = accountService.createAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    /**
     * PUT /api/accounts/{id} - Update account
     */
    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(
        @PathVariable Long id,
        @Valid @RequestBody Account account
    ) {
        Account updatedAccount = accountService.updateAccount(id, account);
        return ResponseEntity.ok(updatedAccount);
    }

    /**
     * PATCH /api/accounts/{id}/balance - Update account balance
     */
    @PatchMapping("/{id}/balance")
    public ResponseEntity<Account> updateAccountBalance(
        @PathVariable Long id,
        @RequestParam BigDecimal balance
    ) {
        Account updatedAccount = accountService.updateAccountBalance(id, balance);
        return ResponseEntity.ok(updatedAccount);
    }

    /**
     * PATCH /api/accounts/{id}/deactivate - Deactivate account
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateAccount(@PathVariable Long id) {
        accountService.deactivateAccount(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * DELETE /api/accounts/{id} - Delete account
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/accounts/total-balance - Get total balance across all active accounts
     */
    @GetMapping("/total-balance")
    public ResponseEntity<BigDecimal> getTotalBalance() {
        BigDecimal totalBalance = accountService.calculateTotalBalance();
        return ResponseEntity.ok(totalBalance);
    }
}