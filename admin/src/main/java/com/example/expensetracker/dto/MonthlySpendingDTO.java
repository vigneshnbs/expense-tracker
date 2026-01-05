package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for monthly spending by category
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySpendingDTO {

    private Long categoryId;
    private String categoryName;
    private BigDecimal totalSpent;
}