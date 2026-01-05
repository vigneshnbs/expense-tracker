import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { accountsApi } from 'src/api';
import { CreateAccountRequest } from 'src/types/models';
import { AccountForm } from '../components/AccountForm';
import useToast from 'src/hooks/useToast';

export const CreateAccountPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();

  const createMutation = useMutation({
    mutationFn: accountsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      addSuccessToast('Account created successfully');
      navigate('/accounts');
    },
    onError: () => {
      addErrorToast('Failed to create account');
    },
  });

  const handleSubmit = (data: CreateAccountRequest) => {
    createMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Create Account
      </Typography>

      <Card>
        <CardContent>
          <AccountForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/accounts')}
            isSubmitting={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
