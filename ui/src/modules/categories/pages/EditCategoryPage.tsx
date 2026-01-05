import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriesApi } from 'src/api';
import { CreateCategoryRequest } from 'src/types/models';
import { CategoryForm } from '../components/CategoryForm';
import useToast from 'src/hooks/useToast';

export const EditCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();

  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.getById(Number(id)),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      categoriesApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      addSuccessToast('Category updated successfully');
      navigate('/categories');
    },
    onError: () => {
      addErrorToast('Failed to update category');
    },
  });

  const handleSubmit = (data: CreateCategoryRequest) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!category) {
    return <Typography>Category not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Edit Category
      </Typography>

      <Card>
        <CardContent>
          <CategoryForm
            category={category}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/categories')}
            isSubmitting={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
