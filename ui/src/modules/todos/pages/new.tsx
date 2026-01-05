import { useTranslation } from 'react-i18next';
import { TodoForm } from '../components/todo-form';

export const NewPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h4> {t('todos.title')}</h4>
      <TodoForm />
    </div>
  );
};
