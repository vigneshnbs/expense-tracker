import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { Account, CreateAccountRequest } from 'src/types/models';
import { AccountType } from 'src/types/enums';

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: CreateAccountRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const AccountForm = ({
  account,
  onSubmit,
  onCancel,
  isSubmitting,
}: AccountFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountRequest>({
    defaultValues: {
      accountName: account?.accountName || '',
      accountType: account?.accountType || AccountType.SAVINGS,
      currentBalance: account?.currentBalance || 0,
      isActive: account?.isActive ?? true,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="accountName"
        control={control}
        rules={{ required: 'Account name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Account Name"
            fullWidth
            margin="normal"
            error={!!errors.accountName}
            helperText={errors.accountName?.message}
          />
        )}
      />

      <Controller
        name="accountType"
        control={control}
        rules={{ required: 'Account type is required' }}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.accountType}>
            <InputLabel>Account Type</InputLabel>
            <Select {...field} label="Account Type">
              {Object.values(AccountType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="currentBalance"
        control={control}
        rules={{
          required: 'Balance is required',
          min: { value: 0, message: 'Balance cannot be negative' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Current Balance"
            type="number"
            fullWidth
            margin="normal"
            error={!!errors.currentBalance}
            helperText={errors.currentBalance?.message}
            onChange={(e) => field.onChange(parseFloat(e.target.value))}
          />
        )}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value} />}
            label="Active"
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
          {account ? 'Update' : 'Create'} Account
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
