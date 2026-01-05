import { screen } from '@testing-library/react';
import { visit } from 'src/testing-helpers/render-providers';

describe('Page | Todo | DetailPage', () => {
  it('should render the todo detail page', async () => {
    await visit({ route: '/todos/1' });

    // Assert that the todo detail page is rendered
    expect(screen.getByText('common.loading')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-form')).not.toBeInTheDocument();

    // Wait for the todo data to be loaded and the form to be rendered
    expect(await screen.findByTestId('todo-form')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a title')).toHaveValue(
      'Test title',
    );
    expect(screen.getByLabelText('todos.todoForm.completed')).toBeChecked();

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveTextContent('common.save');
  });
});
