import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Todo } from '../interfaces/todo';
import { createTodo, updateTodo } from '../todo.api';
import Button from '@mui/material/Button';
import useToast from 'src/hooks/useToast';

export const TodoForm = ({ todo }: { todo?: Todo }) => {
  const navigate = useNavigate();
  const { addSuccessToast } = useToast();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: todo || {
      title: '',
      userId: 1,
      id: (Math.floor(Math.random() * 1000) + 1).toString(),
      completed: false,
    },
  });

  const { t } = useTranslation();
  const { mutate: createMutate } = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      addSuccessToast(t('todos.todoForm.createSuccess'));
      navigate('/todos');
    },
  });
  const { mutate: updateMutate } = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      addSuccessToast(t('todos.todoForm.updateSuccess'));
      navigate('/todos');
    },
  });

  const onSubmit = (data: Todo) => {
    if (todo) {
      updateMutate(data);
    } else {
      createMutate(data);
    }
    reset(todo);
  };

  return (
    <form data-testid="todo-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <TextField
          id="outlined-basic"
          label={t('todos.todoForm.title')}
          placeholder="Enter a title"
          {...register('title')}
        />
      </div>
      <div>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox {...register('completed')} />}
            label={t('todos.todoForm.completed')}
          />
        </FormGroup>
      </div>
      <Button type="submit" data-testid="submit-button" variant="contained">
        {t('common.save')}
      </Button>
    </form>
  );
};
