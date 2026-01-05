package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for budget vs actual spending comparison
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetComparisonDTO {

    private Long categoryId;
    private String categoryName;
    private BigDecimal budgetedAmount;
    private BigDecimal actualSpent;
    private BigDecimal remaining;
    private Double percentageUsed;
}