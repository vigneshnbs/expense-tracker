import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { budgetApi, categoriesApi } from 'src/api';
import { CategoryType } from 'src/types/enums';
import { formatCurrency } from 'src/utils';
import useToast from 'src/hooks/useToast';

export const BudgetPage = () => {
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [budgetAmount, setBudgetAmount] = useState<string>('');

  const { data: budgetComparison, isLoading: isLoadingComparison } = useQuery({
    queryKey: ['budgetComparison'],
    queryFn: budgetApi.getComparison,
  });

  const { data: totalBudget, isLoading: isLoadingTotal } = useQuery({
    queryKey: ['totalBudget'],
    queryFn: budgetApi.getTotal,
  });

  const { data: expenseCategories } = useQuery({
    queryKey: ['categories', 'byType', CategoryType.EXPENSE],
    queryFn: () => categoriesApi.getByType(CategoryType.EXPENSE),
  });

  const updateBudgetMutation = useMutation({
    mutationFn: ({
      categoryId,
      amount,
    }: {
      categoryId: number;
      amount: number;
    }) => budgetApi.updateByCategory(categoryId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetComparison'] });
      queryClient.invalidateQueries({ queryKey: ['totalBudget'] });
      queryClient.invalidateQueries({ queryKey: ['budgetAllocations'] });
      addSuccessToast('Budget updated successfully');
      setEditDialogOpen(false);
    },
    onError: () => {
      addErrorToast('Failed to update budget');
    },
  });

  const handleEdit = (categoryId: number, currentAmount: number) => {
    setSelectedCategoryId(categoryId);
    setBudgetAmount(currentAmount.toString());
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedCategoryId && budgetAmount) {
      updateBudgetMutation.mutate({
        categoryId: selectedCategoryId,
        amount: parseFloat(budgetAmount),
      });
    }
  };

  if (isLoadingComparison || isLoadingTotal) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const totalActual =
    budgetComparison?.reduce((sum, item) => sum + item.actualSpent, 0) || 0;

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Budget Management
      </Typography>

      {/* Summary Cards */}
      <Box display="flex" gap={3} mb={4}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Budget
            </Typography>
            <Typography variant="h5">
              {formatCurrency(totalBudget || 0)}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Spent
            </Typography>
            <Typography variant="h5">{formatCurrency(totalActual)}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Remaining
            </Typography>
            <Typography
              variant="h5"
              color={
                totalBudget && totalActual > totalBudget ? 'error' : 'success'
              }
            >
              {formatCurrency((totalBudget || 0) - totalActual)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Budget Comparison Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Budget vs Actual (Current Month)
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Budgeted</TableCell>
                  <TableCell align="right">Spent</TableCell>
                  <TableCell align="right">Remaining</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgetComparison?.map((item) => {
                  const isOverBudget = item.percentageUsed > 100;
                  const progressColor = isOverBudget
                    ? 'error'
                    : item.percentageUsed > 80
                      ? 'warning'
                      : 'primary';

                  return (
                    <TableRow key={item.categoryId}>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.budgetedAmount)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.actualSpent)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: isOverBudget
                            ? 'error.main'
                            : 'success.main',
                        }}
                      >
                        {formatCurrency(item.remaining)}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(item.percentageUsed, 100)}
                              color={progressColor}
                            />
                          </Box>
                          <Typography variant="caption">
                            {item.percentageUsed.toFixed(0)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleEdit(item.categoryId, item.budgetedAmount)
                          }
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* Show categories without budget */}
                {expenseCategories
                  ?.filter(
                    (cat) =>
                      !budgetComparison?.some((b) => b.categoryId === cat.id),
                  )
                  .map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell align="right" colSpan={4}>
                        <Typography color="textSecondary" variant="body2">
                          No budget set
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEdit(cat.id, 0)}
                        >
                          Set Budget
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {budgetComparison?.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="textSecondary">
                No budget allocations found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Update Budget Allocation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Budget Amount"
            type="number"
            fullWidth
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            inputProps={{ step: '0.01', min: '0' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={updateBudgetMutation.isPending}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
