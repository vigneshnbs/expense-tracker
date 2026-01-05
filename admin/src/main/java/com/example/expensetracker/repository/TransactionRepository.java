package com.example.expensetracker.repository;

import com.example.expensetracker.enums.TransactionType;
import com.example.expensetracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for Transaction entity
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Find transactions by account ID
     */
    List<Transaction> findByAccountId(Long accountId);

    /**
     * Find transactions by category ID
     */
    List<Transaction> findByCategoryId(Long categoryId);

    /**
     * Find transactions by type
     */
    List<Transaction> findByTransactionType(TransactionType transactionType);

    /**
     * Find transactions within a date range
     */
    List<Transaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * Find transactions by account and date range
     */
    List<Transaction> findByAccountIdAndTransactionDateBetween(
        Long accountId, LocalDate startDate, LocalDate endDate
    );

    /**
     * Find transactions by category and date range
     */
    List<Transaction> findByCategoryIdAndTransactionDateBetween(
        Long categoryId, LocalDate startDate, LocalDate endDate
    );

    /**
     * Find linked transfer transactions by reference ID
     */
    List<Transaction> findByTransferReferenceId(String transferReferenceId);

    /**
     * Calculate total amount by category and date range
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.categoryId = :categoryId " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByCategoryIdAndDateRange(
        @Param("categoryId") Long categoryId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    /**
     * Get monthly spending by category
     */
    @Query("SELECT t.categoryId, SUM(t.amount) FROM Transaction t " +
           "WHERE t.transactionType = :transactionType " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.categoryId")
    List<Object[]> getMonthlySpendingByCategory(
        @Param("transactionType") TransactionType transactionType,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}