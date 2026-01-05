import { screen } from '@testing-library/react';
import { visit } from 'src/testing-helpers/render-providers';

describe('Page | Todo | New page', () => {
  it('should render the todo new page', async () => {
    await visit({ route: '/todos/new' });

    screen.getByTestId('todo-form');
    expect(screen.getByPlaceholderText('Enter a title')).toHaveValue('');
    expect(screen.getByLabelText('todos.todoForm.completed')).not.toBeChecked();

    screen.getByText('common.save');
  });
});
