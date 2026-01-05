import Button from '@mui/material/Button';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Todo } from '../interfaces/todo';
import { getTodos } from '../todo.api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export const TodosPage = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) return <div>{t('common.loading')}</div>;

  return (
    <div>
      <h4>{t('todos.title')}</h4>
      <Button onClick={() => navigate('/todos/new')} variant="contained">
        {t('todos.new')}
      </Button>
      <TableContainer>
        <Table data-testid="todos-list">
          <TableHead>
            <TableRow>
              <TableCell>{t('todos.table.id')}</TableCell>
              <TableCell>{t('todos.table.userId')}</TableCell>
              <TableCell>{t('todos.table.title')}</TableCell>
              <TableCell>{t('todos.table.completed')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((todo: Todo) => (
              <TableRow
                key={todo.id}
                data-testid="todo-data-row"
                onClick={() => navigate(`/todos/${todo.id}`)}
              >
                <TableCell>{todo.id}</TableCell>
                <TableCell>{todo.userId}</TableCell>
                <TableCell>{todo.title}</TableCell>
                <TableCell>
                  {todo.completed ? 'Completed' : 'Not completed'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
