import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
} from '@mui/material';
import { Transaction } from 'src/types/models';
import { formatCurrency, formatDate } from 'src/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions = ({
  transactions,
}: RecentTransactionsProps) => {
  if (transactions.length === 0) {
    return (
      <Typography color="textSecondary">No transactions found</Typography>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <Chip
                  label={transaction.transactionType}
                  color={
                    transaction.transactionType === 'EXPENSE'
                      ? 'error'
                      : transaction.transactionType === 'INCOME'
                        ? 'success'
                        : 'default'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                {formatCurrency(transaction.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
