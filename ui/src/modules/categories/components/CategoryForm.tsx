import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Category, CreateCategoryRequest } from 'src/types/models';
import { CategoryType } from 'src/types/enums';
import { categoriesApi } from 'src/api';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const DEFAULT_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B739',
  '#52B788',
];

export const CategoryForm = ({
  category,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoryFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryRequest>({
    defaultValues: {
      name: category?.name || '',
      type: category?.type || CategoryType.EXPENSE,
      parentCategoryId: category?.parentCategoryId || null,
      colorCode: category?.colorCode || DEFAULT_COLORS[0],
    },
  });

  const selectedType = watch('type');

  // Fetch categories of the same type for parent dropdown
  const { data: parentCategories } = useQuery({
    queryKey: ['categories', 'byType', selectedType],
    queryFn: () => categoriesApi.getByType(selectedType),
  });

  // Filter out current category and its children from parent options
  const availableParents = parentCategories?.filter(
    (cat) => cat.id !== category?.id && cat.parentCategoryId !== category?.id,
  );

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Category name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Category Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        rules={{ required: 'Category type is required' }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.type}>
            <InputLabel>Category Type</InputLabel>
            <Select {...field} label="Category Type">
              <MenuItem value={CategoryType.EXPENSE}>Expense</MenuItem>
              <MenuItem value={CategoryType.INCOME}>Income</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="parentCategoryId"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Parent Category (Optional)</InputLabel>
            <Select
              {...field}
              label="Parent Category (Optional)"
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value || null)}
            >
              <MenuItem value="">
                <em>None (Top Level)</em>
              </MenuItem>
              {availableParents?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="colorCode"
        control={control}
        render={({ field }) => (
          <Box mt={2}>
            <InputLabel>Color</InputLabel>
            <Box display="flex" gap={1} mt={1} flexWrap="wrap">
              {DEFAULT_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => field.onChange(color)}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border:
                      field.value === color
                        ? '3px solid #000'
                        : '2px solid #ccc',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      />

      <Box mt={3} display="flex" gap={2}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {category ? 'Update' : 'Create'} Category
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
