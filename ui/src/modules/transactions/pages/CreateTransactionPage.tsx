import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { transactionsApi } from 'src/api';
import { CreateTransactionRequest } from 'src/types/models';
import { TransactionForm } from '../components/TransactionForm';
import useToast from 'src/hooks/useToast';

export const CreateTransactionPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();

  const createMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      addSuccessToast('Transaction created successfully');
      navigate('/transactions');
    },
    onError: () => {
      addErrorToast('Failed to create transaction');
    },
  });

  const handleSubmit = (data: CreateTransactionRequest) => {
    createMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Create Transaction
      </Typography>

      <Card>
        <CardContent>
          <TransactionForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/transactions')}
            isSubmitting={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
