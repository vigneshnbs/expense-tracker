package com.example.expensetracker.dto;

import com.example.expensetracker.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for account summary with transaction count
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountSummaryDTO {

    private Long id;
    private String accountName;
    private AccountType accountType;
    private BigDecimal currentBalance;
    private Boolean isActive;
    private Long transactionCount;
}