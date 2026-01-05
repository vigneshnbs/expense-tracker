import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { transactionsApi, accountsApi, categoriesApi } from 'src/api';
import { formatCurrency, formatDate, getFirstDayOfMonth, getLastDayOfMonth } from 'src/utils';
import useToast from 'src/hooks/useToast';

export const TransactionsListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();

  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getLastDayOfMonth());
  const [selectedAccount, setSelectedAccount] = useState<number | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionsApi.getAll,
  });

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      addSuccessToast('Transaction deleted successfully');
    },
    onError: () => {
      addErrorToast('Failed to delete transaction');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Filter transactions
  const filteredTransactions = transactions?.filter((txn) => {
    const txnDate = new Date(txn.transactionDate);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dateMatch = txnDate >= start && txnDate <= end;
    const accountMatch = !selectedAccount || txn.accountId === selectedAccount;
    const categoryMatch = !selectedCategory || txn.categoryId === selectedCategory;

    return dateMatch && accountMatch && categoryMatch;
  });

  const getAccountName = (accountId: number) =>
    accounts?.find((a) => a.id === accountId)?.accountName || 'Unknown';

  const getCategoryName = (categoryId: number) =>
    categories?.find((c) => c.id === categoryId)?.name || 'Unknown';

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Transactions</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => navigate('/transactions/transfer')}
          >
            Transfer
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/transactions/new')}
          >
            Add Transaction
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Account</InputLabel>
              <Select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value as number)}
                label="Account"
              >
                <MenuItem value="">All Accounts</MenuItem>
                {accounts?.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.accountName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as number)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {transaction.description}
                        </Typography>
                        {transaction.notes && (
                          <Typography variant="caption" color="textSecondary">
                            {transaction.notes}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{getAccountName(transaction.accountId)}</TableCell>
                    <TableCell>{getCategoryName(transaction.categoryId)}</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.transactionType}
                        color={
                          transaction.transactionType === 'EXPENSE'
                            ? 'error'
                            : transaction.transactionType === 'INCOME'
                            ? 'success'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/transactions/${transaction.id}/edit`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredTransactions?.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="textSecondary">No transactions found</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
