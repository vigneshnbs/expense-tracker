package com.example.expensetracker.repository;

import com.example.expensetracker.model.BudgetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for BudgetAllocation entity
 */
@Repository
public interface BudgetAllocationRepository extends JpaRepository<BudgetAllocation, Long> {

    /**
     * Find budget allocation by category ID
     */
    Optional<BudgetAllocation> findByCategoryId(Long categoryId);

    /**
     * Check if budget allocation exists for a category
     */
    boolean existsByCategoryId(Long categoryId);

    /**
     * Delete budget allocation by category ID
     */
    void deleteByCategoryId(Long categoryId);
}