import styled from 'styled-components';
import { colors } from './colors';

/**
 * Styled Components for Custom Elements
 * Use these for elements that need special styling beyond MUI
 */

// Gradient Button (if you need non-MUI buttons)
export const GradientButton = styled.button`
  background: ${colors.primary.gradient};
  color: ${colors.primary.contrastText};
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;

  &:hover {
    background: ${colors.primary.gradientHover};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  &:active {
    background: ${colors.primary.gradientHover};
    transform: scale(0.98);
  }

  &:disabled {
    background: ${colors.divider};
    color: ${colors.text.disabled};
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Income/Expense Badge
export const TransactionBadge = styled.span<{
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.type) {
      case 'INCOME':
        return colors.semantic.income.main;
      case 'EXPENSE':
        return colors.semantic.expense.main;
      case 'TRANSFER':
        return colors.semantic.transfer.main;
      default:
        return colors.divider;
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'INCOME':
        return colors.semantic.income.contrastText;
      case 'EXPENSE':
        return colors.semantic.expense.contrastText;
      case 'TRANSFER':
        return colors.semantic.transfer.contrastText;
      default:
        return colors.text.primary;
    }
  }};
`;

// Budget Status Indicator
export const BudgetStatusBar = styled.div<{ percentageUsed: number }>`
  width: 100%;
  height: 8px;
  background-color: ${colors.divider};
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) => Math.min(props.percentageUsed, 100)}%;
    background-color: ${(props) => {
      if (props.percentageUsed > 100) return colors.budget.overBudget;
      if (props.percentageUsed >= 80) return colors.budget.warning;
      return colors.budget.onTrack;
    }};
    transition: width 0.3s ease, background-color 0.3s ease;
  }
`;

// Card with gradient border
export const GradientCard = styled.div`
  background: ${colors.background.paper};
  border-radius: 12px;
  padding: 24px;
  position: relative;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${colors.primary.gradient};
    border-radius: 12px 12px 0 0;
  }

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

// Amount Display (for showing money values)
export const AmountDisplay = styled.div<{ type?: 'INCOME' | 'EXPENSE' }>`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => {
    if (props.type === 'INCOME') return colors.semantic.income.dark;
    if (props.type === 'EXPENSE') return colors.semantic.expense.dark;
    return colors.text.primary;
  }};
`;

// Category Color Dot
export const CategoryDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 2px solid ${colors.background.paper};
  box-shadow: 0 0 0 1px ${colors.divider};
`;

// Status Badge for budget
export const StatusBadge = styled.span<{ status: 'onTrack' | 'warning' | 'over' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.status) {
      case 'onTrack':
        return colors.budget.onTrack;
      case 'warning':
        return colors.budget.warning;
      case 'over':
        return colors.budget.overBudget;
      default:
        return colors.divider;
    }
  }};
  color: ${(props) =>
    props.status === 'onTrack' || props.status === 'warning'
      ? colors.text.primary
      : colors.primary.contrastText};
`;

// Gradient Text
export const GradientText = styled.span`
  background: ${colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

// Icon Button with gradient hover
export const GradientIconButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: ${colors.text.secondary};
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${colors.primary.gradient};
    color: ${colors.primary.contrastText};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    color: ${colors.text.disabled};
    cursor: not-allowed;
    &:hover {
      background: transparent;
    }
  }
`;
