import { Box, Typography } from '@mui/material';
import { MonthlySpendingDTO } from 'src/types/models';
import { formatCurrency } from 'src/utils';

interface MonthlySpendingChartProps {
  spending: MonthlySpendingDTO[];
}

export const MonthlySpendingChart = ({
  spending,
}: MonthlySpendingChartProps) => {
  if (spending.length === 0) {
    return <Typography color="textSecondary">No spending data found</Typography>;
  }

  const maxSpent = Math.max(...spending.map((s) => s.totalSpent));

  return (
    <Box>
      {spending.map((item) => (
        <Box key={item.categoryId} mb={2}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">{item.categoryName}</Typography>
            <Typography variant="body2" fontWeight="bold">
              {formatCurrency(item.totalSpent)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              height: 20,
              bgcolor: 'grey.200',
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                width: `${(item.totalSpent / maxSpent) * 100}%`,
                height: '100%',
                bgcolor: 'primary.main',
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
