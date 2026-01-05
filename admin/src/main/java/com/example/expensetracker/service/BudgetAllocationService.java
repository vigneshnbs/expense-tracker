package com.example.expensetracker.service;

import com.example.expensetracker.dto.BudgetComparisonDTO;
import com.example.expensetracker.model.BudgetAllocation;
import com.example.expensetracker.model.Category;
import com.example.expensetracker.repository.BudgetAllocationRepository;
import com.example.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

/**
 * Service layer for BudgetAllocation operations
 */
@Service
@RequiredArgsConstructor
public class BudgetAllocationService {

    private final BudgetAllocationRepository budgetAllocationRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;

    /**
     * Get all budget allocations
     */
    public List<BudgetAllocation> getAllBudgetAllocations() {
        return budgetAllocationRepository.findAll();
    }

    /**
     * Get budget allocation by ID
     */
    public BudgetAllocation getBudgetAllocationById(Long id) {
        return budgetAllocationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget allocation not found with id: " + id));
    }

    /**
     * Get budget allocation by category ID
     */
    public BudgetAllocation getBudgetAllocationByCategory(Long categoryId) {
        return budgetAllocationRepository.findByCategoryId(categoryId)
            .orElseThrow(() -> new RuntimeException("Budget allocation not found for category id: " + categoryId));
    }

    /**
     * Create new budget allocation
     */
    @Transactional
    public BudgetAllocation createBudgetAllocation(BudgetAllocation budgetAllocation) {
        // Validate category exists
        if (!categoryService.categoryExists(budgetAllocation.getCategoryId())) {
            throw new RuntimeException("Category not found with id: " + budgetAllocation.getCategoryId());
        }

        // Check if budget allocation already exists for this category
        if (budgetAllocationRepository.existsByCategoryId(budgetAllocation.getCategoryId())) {
            throw new RuntimeException("Budget allocation already exists for category id: " +
                budgetAllocation.getCategoryId());
        }

        return budgetAllocationRepository.save(budgetAllocation);
    }

    /**
     * Update existing budget allocation
     */
    @Transactional
    public BudgetAllocation updateBudgetAllocation(Long id, BudgetAllocation budgetDetails) {
        BudgetAllocation budgetAllocation = getBudgetAllocationById(id);

        budgetAllocation.setCategoryId(budgetDetails.getCategoryId());
        budgetAllocation.setAllocatedAmount(budgetDetails.getAllocatedAmount());

        return budgetAllocationRepository.save(budgetAllocation);
    }

    /**
     * Update budget allocation for a specific category
     */
    @Transactional
    public BudgetAllocation updateBudgetAllocationByCategory(Long categoryId, BigDecimal allocatedAmount) {
        BudgetAllocation budgetAllocation = budgetAllocationRepository.findByCategoryId(categoryId)
            .orElse(new BudgetAllocation());

        budgetAllocation.setCategoryId(categoryId);
        budgetAllocation.setAllocatedAmount(allocatedAmount);

        return budgetAllocationRepository.save(budgetAllocation);
    }

    /**
     * Delete budget allocation
     */
    @Transactional
    public void deleteBudgetAllocation(Long id) {
        if (!budgetAllocationRepository.existsById(id)) {
            throw new RuntimeException("Budget allocation not found with id: " + id);
        }
        budgetAllocationRepository.deleteById(id);
    }

    /**
     * Get budget vs actual spending comparison for current month
     */
    public List<BudgetComparisonDTO> getBudgetComparison() {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();

        return getBudgetComparison(startDate, endDate);
    }

    /**
     * Get budget vs actual spending comparison for specified date range
     */
    public List<BudgetComparisonDTO> getBudgetComparison(LocalDate startDate, LocalDate endDate) {
        List<BudgetAllocation> budgetAllocations = budgetAllocationRepository.findAll();
        List<BudgetComparisonDTO> comparisonList = new ArrayList<>();

        for (BudgetAllocation allocation : budgetAllocations) {
            Category category = categoryService.getCategoryById(allocation.getCategoryId());

            // Calculate actual spending for this category
            BigDecimal actualSpent = transactionRepository.sumAmountByCategoryIdAndDateRange(
                allocation.getCategoryId(), startDate, endDate
            );

            if (actualSpent == null) {
                actualSpent = BigDecimal.ZERO;
            }

            // Calculate remaining budget
            BigDecimal remaining = allocation.getAllocatedAmount().subtract(actualSpent);

            // Calculate percentage used
            Double percentageUsed = 0.0;
            if (allocation.getAllocatedAmount().compareTo(BigDecimal.ZERO) > 0) {
                percentageUsed = actualSpent
                    .divide(allocation.getAllocatedAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
            }

            BudgetComparisonDTO dto = new BudgetComparisonDTO();
            dto.setCategoryId(allocation.getCategoryId());
            dto.setCategoryName(category.getName());
            dto.setBudgetedAmount(allocation.getAllocatedAmount());
            dto.setActualSpent(actualSpent);
            dto.setRemaining(remaining);
            dto.setPercentageUsed(percentageUsed);

            comparisonList.add(dto);
        }

        return comparisonList;
    }

    /**
     * Calculate total budget across all categories
     */
    public BigDecimal calculateTotalBudget() {
        return budgetAllocationRepository.findAll().stream()
            .map(BudgetAllocation::getAllocatedAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}