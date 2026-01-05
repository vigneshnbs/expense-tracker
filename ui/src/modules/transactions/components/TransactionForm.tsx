import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import { Transaction, CreateTransactionRequest } from 'src/types/models';
import { TransactionType, CategoryType } from 'src/types/enums';
import { accountsApi, categoriesApi } from 'src/api';
import { getTodayISO } from 'src/utils';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: CreateTransactionRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
  isSubmitting,
}: TransactionFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateTransactionRequest>({
    defaultValues: {
      accountId: transaction?.accountId || 0,
      categoryId: transaction?.categoryId || 0,
      amount: transaction?.amount || 0,
      transactionType: transaction?.transactionType || TransactionType.EXPENSE,
      transactionDate: transaction?.transactionDate || getTodayISO(),
      description: transaction?.description || '',
      notes: transaction?.notes || '',
    },
  });

  const selectedType = watch('transactionType');

  const { data: accounts } = useQuery({
    queryKey: ['accounts', 'active'],
    queryFn: accountsApi.getActive,
  });

  const { data: categories } = useQuery({
    queryKey: [
      'categories',
      'byType',
      selectedType === TransactionType.EXPENSE
        ? CategoryType.EXPENSE
        : CategoryType.INCOME,
    ],
    queryFn: () =>
      categoriesApi.getByType(
        selectedType === TransactionType.EXPENSE
          ? CategoryType.EXPENSE
          : CategoryType.INCOME,
      ),
    enabled: selectedType !== TransactionType.TRANSFER,
  });

  // For transfers, show all categories
  const { data: allCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    enabled: selectedType === TransactionType.TRANSFER,
  });

  const categoryOptions =
    selectedType === TransactionType.TRANSFER ? allCategories : categories;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="transactionType"
        control={control}
        rules={{ required: 'Transaction type is required' }}
        render={({ field }) => (
          <FormControl component="fieldset" margin="normal">
            <RadioGroup {...field} row>
              <FormControlLabel
                value={TransactionType.EXPENSE}
                control={<Radio />}
                label="Expense"
              />
              <FormControlLabel
                value={TransactionType.INCOME}
                control={<Radio />}
                label="Income"
              />
              <FormControlLabel
                value={TransactionType.TRANSFER}
                control={<Radio />}
                label="Transfer"
              />
            </RadioGroup>
          </FormControl>
        )}
      />

      <Controller
        name="accountId"
        control={control}
        rules={{ required: 'Account is required', min: 1 }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.accountId}>
            <InputLabel>Account</InputLabel>
            <Select {...field} label="Account">
              <MenuItem value={0} disabled>
                Select an account
              </MenuItem>
              {accounts?.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.accountName} ({account.accountType})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="categoryId"
        control={control}
        rules={{ required: 'Category is required', min: 1 }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select {...field} label="Category">
              <MenuItem value={0} disabled>
                Select a category
              </MenuItem>
              {categoryOptions?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="amount"
        control={control}
        rules={{
          required: 'Amount is required',
          min: { value: 0.01, message: 'Amount must be greater than 0' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            error={!!errors.amount}
            helperText={errors.amount?.message}
            onChange={(e) => field.onChange(parseFloat(e.target.value))}
            inputProps={{ step: '0.01' }}
          />
        )}
      />

      <Controller
        name="transactionDate"
        control={control}
        rules={{ required: 'Date is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            error={!!errors.transactionDate}
            helperText={errors.transactionDate?.message}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        rules={{ required: 'Description is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            margin="normal"
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Notes (Optional)"
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        )}
      />

      <Box mt={3} display="flex" gap={2}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {transaction ? 'Update' : 'Create'} Transaction
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
