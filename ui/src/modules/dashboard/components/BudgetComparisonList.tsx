import { Box, LinearProgress, Typography } from '@mui/material';
import { BudgetComparisonDTO } from 'src/types/models';
import { formatCurrency } from 'src/utils';

interface BudgetComparisonListProps {
  comparisons: BudgetComparisonDTO[];
}

export const BudgetComparisonList = ({
  comparisons,
}: BudgetComparisonListProps) => {
  if (comparisons.length === 0) {
    return (
      <Typography color="textSecondary">No budget allocations found</Typography>
    );
  }

  return (
    <Box>
      {comparisons.map((comparison) => (
        <Box key={comparison.categoryId} mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">{comparison.categoryName}</Typography>
            <Typography variant="body2">
              {formatCurrency(comparison.actualSpent)} /{' '}
              {formatCurrency(comparison.budgetedAmount)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(comparison.percentageUsed, 100)}
            color={comparison.percentageUsed > 100 ? 'error' : 'primary'}
          />
          <Typography variant="caption" color="textSecondary">
            {comparison.percentageUsed.toFixed(1)}% used •{' '}
            {formatCurrency(comparison.remaining)} remaining
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
