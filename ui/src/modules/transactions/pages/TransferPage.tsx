import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { transactionsApi, accountsApi, categoriesApi } from 'src/api';
import { TransferRequest } from 'src/types/models';
import { getTodayISO } from 'src/utils';
import useToast from 'src/hooks/useToast';

export const TransferPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessToast, addErrorToast } = useToast();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransferRequest>({
    defaultValues: {
      fromAccountId: 0,
      toAccountId: 0,
      categoryId: 0,
      amount: 0,
      transactionDate: getTodayISO(),
      description: '',
      notes: '',
    },
  });

  const fromAccountId = watch('fromAccountId');

  const { data: accounts } = useQuery({
    queryKey: ['accounts', 'active'],
    queryFn: accountsApi.getActive,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const transferMutation = useMutation({
    mutationFn: transactionsApi.createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      addSuccessToast('Transfer completed successfully');
      navigate('/transactions');
    },
    onError: () => {
      addErrorToast('Failed to complete transfer');
    },
  });

  const onSubmit = (data: TransferRequest) => {
    transferMutation.mutate(data);
  };

  // Filter out the selected "from" account from "to" options
  const toAccountOptions = accounts?.filter(
    (account) => account.id !== fromAccountId,
  );

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Transfer Between Accounts
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="fromAccountId"
              control={control}
              rules={{ required: 'From account is required', min: 1 }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.fromAccountId}
                >
                  <InputLabel>From Account</InputLabel>
                  <Select {...field} label="From Account">
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
              name="toAccountId"
              control={control}
              rules={{ required: 'To account is required', min: 1 }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.toAccountId}
                >
                  <InputLabel>To Account</InputLabel>
                  <Select {...field} label="To Account">
                    <MenuItem value={0} disabled>
                      Select an account
                    </MenuItem>
                    {toAccountOptions?.map((account) => (
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
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.categoryId}
                >
                  <InputLabel>Category</InputLabel>
                  <Select {...field} label="Category">
                    <MenuItem value={0} disabled>
                      Select a category
                    </MenuItem>
                    {categories?.map((category) => (
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
                disabled={transferMutation.isPending}
              >
                Complete Transfer
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/transactions')}
                disabled={transferMutation.isPending}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
