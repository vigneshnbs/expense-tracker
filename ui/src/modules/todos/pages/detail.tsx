import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { TodoForm } from '../components/todo-form';
import { getTodo } from '../todo.api';
import { useTranslation } from 'react-i18next';

export const DetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: todo, isLoading } = useQuery({
    queryKey: ['todos', id],
    queryFn: () => getTodo(id as string),
  });

  if (isLoading) return <div>{t('common.loading')}</div>;

  return (
    <div data-testid="todo-detail-page">
      <h4>{todo.title}</h4>
      {todo && <TodoForm todo={todo} />}
    </div>
  );
};
