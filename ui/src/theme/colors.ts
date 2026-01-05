/**
 * Expense Tracker Color Theme
 * Centralized color definitions for the entire application
 */

export const colors = {
  // Primary Gradient Colors
  primary: {
    gradient: 'linear-gradient(to left bottom, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234))',
    gradientHover: 'linear-gradient(to left bottom, rgb(110, 231, 155), rgb(37, 99, 235), rgb(126, 34, 206))',
    // Individual gradient stops for flexibility
    gradientStart: '#86EFAC', // rgb(134, 239, 172)
    gradientMiddle: '#3B82F6', // rgb(59, 130, 246)
    gradientEnd: '#9333EA', // rgb(147, 51, 234)
    // Material-UI requires a solid color for some components
    main: '#3B82F6', // Using the middle color as main
    light: '#86EFAC',
    dark: '#9333EA',
    contrastText: '#FFFFFF',
  },

  // Semantic Colors for Financial Data
  semantic: {
    income: {
      main: '#86EFAC', // rgb(134, 239, 172)
      light: '#BBF7D0',
      dark: '#4ADE80',
      contrastText: '#111827',
    },
    expense: {
      main: '#F87171', // rgb(248, 113, 113)
      light: '#FCA5A5',
      dark: '#EF4444',
      contrastText: '#FFFFFF',
    },
    transfer: {
      main: '#94A3B8', // rgb(148, 163, 184)
      light: '#CBD5E1',
      dark: '#64748B',
      contrastText: '#FFFFFF',
    },
  },

  // Budget Status Indicators
  budget: {
    onTrack: '#86EFAC', // rgb(134, 239, 172)
    warning: '#FBBF24', // rgb(251, 191, 36)
    overBudget: '#F87171', // rgb(248, 113, 113)
  },

  // UI Foundation
  background: {
    default: '#F9FAFB', // rgb(249, 250, 251)
    paper: '#FFFFFF',
    elevated: '#FFFFFF', // Cards with shadow
  },

  text: {
    primary: '#111827', // rgb(17, 24, 39)
    secondary: '#6B7280', // rgb(107, 114, 128)
    disabled: '#9CA3AF',
  },

  divider: '#E5E7EB', // rgb(229, 231, 235)

  // Additional UI Colors
  success: {
    main: '#86EFAC',
    light: '#BBF7D0',
    dark: '#4ADE80',
    contrastText: '#111827',
  },

  warning: {
    main: '#FBBF24',
    light: '#FCD34D',
    dark: '#F59E0B',
    contrastText: '#111827',
  },

  error: {
    main: '#F87171',
    light: '#FCA5A5',
    dark: '#EF4444',
    contrastText: '#FFFFFF',
  },

  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },

  // Chart Colors (for data visualization)
  chart: [
    '#86EFAC', // green
    '#3B82F6', // blue
    '#9333EA', // purple
    '#F87171', // red
    '#FBBF24', // amber
    '#94A3B8', // gray-blue
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
    '#8B5CF6', // violet
  ],
} as const;

// CSS Variables for use in styled-components or plain CSS
export const cssVariables = `
  :root {
    /* Primary */
    --color-primary-gradient: linear-gradient(to left bottom, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234));
    --color-primary-gradient-hover: linear-gradient(to left bottom, rgb(110, 231, 155), rgb(37, 99, 235), rgb(126, 34, 206));
    --color-primary-main: #3B82F6;

    /* Semantic */
    --color-income: #86EFAC;
    --color-expense: #F87171;
    --color-transfer: #94A3B8;

    /* Budget Status */
    --color-budget-on-track: #86EFAC;
    --color-budget-warning: #FBBF24;
    --color-budget-over: #F87171;

    /* Background */
    --color-bg-default: #F9FAFB;
    --color-bg-paper: #FFFFFF;

    /* Text */
    --color-text-primary: #111827;
    --color-text-secondary: #6B7280;

    /* Borders */
    --color-border: #E5E7EB;
  }
`;

// Helper function to get semantic color based on transaction type
export const getTransactionColor = (type: 'INCOME' | 'EXPENSE' | 'TRANSFER') => {
  switch (type) {
    case 'INCOME':
      return colors.semantic.income.main;
    case 'EXPENSE':
      return colors.semantic.expense.main;
    case 'TRANSFER':
      return colors.semantic.transfer.main;
    default:
      return colors.text.primary;
  }
};

// Helper function to get budget status color
export const getBudgetStatusColor = (percentageUsed: number) => {
  if (percentageUsed > 100) return colors.budget.overBudget;
  if (percentageUsed >= 80) return colors.budget.warning;
  return colors.budget.onTrack;
};

// Helper function for MUI chip color based on transaction type
export const getChipColor = (
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER',
): 'success' | 'error' | 'default' => {
  switch (type) {
    case 'INCOME':
      return 'success';
    case 'EXPENSE':
      return 'error';
    case 'TRANSFER':
      return 'default';
    default:
      return 'default';
  }
};
