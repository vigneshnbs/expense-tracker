package com.example.expensetracker.controller;

import com.example.expensetracker.dto.BudgetComparisonDTO;
import com.example.expensetracker.model.BudgetAllocation;
import com.example.expensetracker.service.BudgetAllocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for BudgetAllocation operations
 */
@RestController
@RequestMapping("/api/budget-allocations")
@RequiredArgsConstructor
public class BudgetAllocationController {

    private final BudgetAllocationService budgetAllocationService;

    /**
     * GET /api/budget-allocations - Get all budget allocations
     */
    @GetMapping
    public ResponseEntity<List<BudgetAllocation>> getAllBudgetAllocations() {
        List<BudgetAllocation> budgetAllocations = budgetAllocationService.getAllBudgetAllocations();
        return ResponseEntity.ok(budgetAllocations);
    }

    /**
     * GET /api/budget-allocations/{id} - Get budget allocation by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<BudgetAllocation> getBudgetAllocationById(@PathVariable Long id) {
        BudgetAllocation budgetAllocation = budgetAllocationService.getBudgetAllocationById(id);
        return ResponseEntity.ok(budgetAllocation);
    }

    /**
     * GET /api/budget-allocations/category/{categoryId} - Get budget allocation by category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<BudgetAllocation> getBudgetAllocationByCategory(@PathVariable Long categoryId) {
        BudgetAllocation budgetAllocation = budgetAllocationService.getBudgetAllocationByCategory(categoryId);
        return ResponseEntity.ok(budgetAllocation);
    }

    /**
     * POST /api/budget-allocations - Create new budget allocation
     */
    @PostMapping
    public ResponseEntity<BudgetAllocation> createBudgetAllocation(
        @Valid @RequestBody BudgetAllocation budgetAllocation
    ) {
        BudgetAllocation createdBudgetAllocation = budgetAllocationService.createBudgetAllocation(budgetAllocation);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudgetAllocation);
    }

    /**
     * PUT /api/budget-allocations/{id} - Update budget allocation
     */
    @PutMapping("/{id}")
    public ResponseEntity<BudgetAllocation> updateBudgetAllocation(
        @PathVariable Long id,
        @Valid @RequestBody BudgetAllocation budgetAllocation
    ) {
        BudgetAllocation updatedBudgetAllocation = budgetAllocationService.updateBudgetAllocation(id, budgetAllocation);
        return ResponseEntity.ok(updatedBudgetAllocation);
    }

    /**
     * PUT /api/budget-allocations/category/{categoryId} - Update budget allocation for category
     */
    @PutMapping("/category/{categoryId}")
    public ResponseEntity<BudgetAllocation> updateBudgetAllocationByCategory(
        @PathVariable Long categoryId,
        @RequestParam BigDecimal allocatedAmount
    ) {
        BudgetAllocation updatedBudgetAllocation = budgetAllocationService.updateBudgetAllocationByCategory(
            categoryId, allocatedAmount
        );
        return ResponseEntity.ok(updatedBudgetAllocation);
    }

    /**
     * DELETE /api/budget-allocations/{id} - Delete budget allocation
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudgetAllocation(@PathVariable Long id) {
        budgetAllocationService.deleteBudgetAllocation(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/budget-allocations/comparison - Get budget vs actual for current month
     */
    @GetMapping("/comparison")
    public ResponseEntity<List<BudgetComparisonDTO>> getBudgetComparison() {
        List<BudgetComparisonDTO> comparison = budgetAllocationService.getBudgetComparison();
        return ResponseEntity.ok(comparison);
    }

    /**
     * GET /api/budget-allocations/comparison/date-range - Get budget vs actual for date range
     */
    @GetMapping("/comparison/date-range")
    public ResponseEntity<List<BudgetComparisonDTO>> getBudgetComparisonByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<BudgetComparisonDTO> comparison = budgetAllocationService.getBudgetComparison(startDate, endDate);
        return ResponseEntity.ok(comparison);
    }

    /**
     * GET /api/budget-allocations/total - Get total budget amount
     */
    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalBudget() {
        BigDecimal totalBudget = budgetAllocationService.calculateTotalBudget();
        return ResponseEntity.ok(totalBudget);
    }
}