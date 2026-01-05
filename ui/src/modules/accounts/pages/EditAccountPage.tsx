import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { accountsApi } from 'src/api';
import { CreateAccountRequest } from 'src/types/models';
import { AccountForm } from '../components/AccountForm';
import useToast from 'src/hooks/useToast';

export const EditAccountPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();

  const { data: account, isLoading } = useQuery({
    queryKey: ['account', id],
    queryFn: () => accountsApi.getById(Number(id)),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateAccountRequest) =>
      accountsApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account', id] });
      addSuccessToast('Account updated successfully');
      navigate('/accounts');
    },
    onError: () => {
      addErrorToast('Failed to update account');
    },
  });

  const handleSubmit = (data: CreateAccountRequest) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!account) {
    return <Typography>Account not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Edit Account
      </Typography>

      <Card>
        <CardContent>
          <AccountForm
            account={account}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/accounts')}
            isSubmitting={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
