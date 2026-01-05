import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { transactionsApi } from 'src/api';
import { CreateTransactionRequest } from 'src/types/models';
import { TransactionForm } from '../components/TransactionForm';
import useToast from 'src/hooks/useToast';

export const EditTransactionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionsApi.getById(Number(id)),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      transactionsApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      addSuccessToast('Transaction updated successfully');
      navigate('/transactions');
    },
    onError: () => {
      addErrorToast('Failed to update transaction');
    },
  });

  const handleSubmit = (data: CreateTransactionRequest) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!transaction) {
    return <Typography>Transaction not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Edit Transaction
      </Typography>

      <Card>
        <CardContent>
          <TransactionForm
            transaction={transaction}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/transactions')}
            isSubmitting={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
