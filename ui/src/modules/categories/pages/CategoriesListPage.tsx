import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { categoriesApi } from 'src/api';
import { CategoryType } from 'src/types/enums';
import useToast from 'src/hooks/useToast';

export const CategoriesListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();
  const [selectedType, setSelectedType] = useState<CategoryType | 'ALL'>('ALL');

  const { data: allCategories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addSuccessToast('Category deleted successfully');
    },
    onError: () => {
      addErrorToast('Failed to delete category');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
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

  // Filter categories based on selected type
  const filteredCategories =
    selectedType === 'ALL'
      ? allCategories
      : allCategories?.filter((cat) => cat.type === selectedType);

  // Organize categories into parent-child structure
  const topLevelCategories = filteredCategories?.filter(
    (cat) => !cat.parentCategoryId,
  );
  const getSubcategories = (parentId: number) =>
    filteredCategories?.filter((cat) => cat.parentCategoryId === parentId) ||
    [];

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/categories/new')}
        >
          Add Category
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Tabs
            value={selectedType}
            onChange={(_, newValue) => setSelectedType(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="All" value="ALL" />
            <Tab label="Expense" value={CategoryType.EXPENSE} />
            <Tab label="Income" value={CategoryType.INCOME} />
          </Tabs>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Parent</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topLevelCategories?.map((category) => {
                  const subcategories = getSubcategories(category.id);
                  return (
                    <>
                      <TableRow key={category.id}>
                        <TableCell>
                          <strong>{category.name}</strong>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={category.type}
                            color={
                              category.type === CategoryType.EXPENSE
                                ? 'error'
                                : 'success'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: category.colorCode || '#ccc',
                              borderRadius: 1,
                              border: '1px solid #ddd',
                            }}
                          />
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/categories/${category.id}/edit`)
                            }
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {subcategories.map((subcat) => (
                        <TableRow key={subcat.id}>
                          <TableCell sx={{ pl: 6 }}>↳ {subcat.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={subcat.type}
                              color={
                                subcat.type === CategoryType.EXPENSE
                                  ? 'error'
                                  : 'success'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: subcat.colorCode || '#ccc',
                                borderRadius: 1,
                                border: '1px solid #ddd',
                              }}
                            />
                          </TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/categories/${subcat.id}/edit`)
                              }
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(subcat.id)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredCategories?.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="textSecondary">
                No categories found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
