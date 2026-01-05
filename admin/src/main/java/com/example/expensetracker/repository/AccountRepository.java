package com.example.expensetracker.repository;

import com.example.expensetracker.enums.AccountType;
import com.example.expensetracker.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Account entity
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    /**
     * Find all active accounts
     */
    List<Account> findByIsActiveTrue();

    /**
     * Find accounts by type
     */
    List<Account> findByAccountType(AccountType accountType);

    /**
     * Find active accounts by type
     */
    List<Account> findByAccountTypeAndIsActiveTrue(AccountType accountType);
}