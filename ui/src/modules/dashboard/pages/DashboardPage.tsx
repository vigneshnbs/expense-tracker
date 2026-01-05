import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import { accountsApi, budgetApi, transactionsApi } from 'src/api';
import { formatCurrency } from 'src/utils';
import { BudgetComparisonList } from '../components/BudgetComparisonList';
import { MonthlySpendingChart } from '../components/MonthlySpendingChart';
import { RecentTransactions } from '../components/RecentTransactions';

export const DashboardPage = () => {
  const { data: totalBalance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['totalBalance'],
    queryFn: accountsApi.getTotalBalance,
  });

  const { data: totalBudget, isLoading: isLoadingBudget } = useQuery({
    queryKey: ['totalBudget'],
    queryFn: budgetApi.getTotal,
  });

  const { data: budgetComparison, isLoading: isLoadingComparison } = useQuery({
    queryKey: ['budgetComparison'],
    queryFn: budgetApi.getComparison,
  });

  const { data: monthlySpending, isLoading: isLoadingSpending } = useQuery({
    queryKey: ['monthlySpending'],
    queryFn: transactionsApi.getMonthlySpending,
  });

  const { data: recentTransactions, isLoading: isLoadingTransactions } =
    useQuery({
      queryKey: ['recentTransactions'],
      queryFn: transactionsApi.getAll,
    });

  const isLoading =
    isLoadingBalance ||
    isLoadingBudget ||
    isLoadingComparison ||
    isLoadingSpending ||
    isLoadingTransactions;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const totalSpent =
    monthlySpending?.reduce((sum, item) => sum + item.totalSpent, 0) || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Balance
              </Typography>
              <Typography variant="h5">
                {formatCurrency(totalBalance || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Budget (Monthly)
              </Typography>
              <Typography variant="h5">
                {formatCurrency(totalBudget || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Spent (This Month)
              </Typography>
              <Typography variant="h5">{formatCurrency(totalSpent)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Budget vs Actual
              </Typography>
              <BudgetComparisonList comparisons={budgetComparison || []} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Spending by Category
              </Typography>
              <MonthlySpendingChart spending={monthlySpending || []} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <RecentTransactions
                transactions={recentTransactions?.slice(0, 10) || []}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
