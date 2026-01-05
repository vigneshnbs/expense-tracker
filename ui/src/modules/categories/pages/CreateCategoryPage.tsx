import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { categoriesApi } from 'src/api';
import { CreateCategoryRequest } from 'src/types/models';
import { CategoryForm } from '../components/CategoryForm';
import useToast from 'src/hooks/useToast';

export const CreateCategoryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addSuccessToast('Category created successfully');
      navigate('/categories');
    },
    onError: () => {
      addErrorToast('Failed to create category');
    },
  });

  const handleSubmit = (data: CreateCategoryRequest) => {
    createMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Create Category
      </Typography>

      <Card>
        <CardContent>
          <CategoryForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/categories')}
            isSubmitting={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
