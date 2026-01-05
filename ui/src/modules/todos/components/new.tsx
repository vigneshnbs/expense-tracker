import { useTranslation } from 'react-i18next';

export const NewTodo = () => {
  const { t } = useTranslation();
  return <div>{t('todo.newPage.Content')}</div>;
};
