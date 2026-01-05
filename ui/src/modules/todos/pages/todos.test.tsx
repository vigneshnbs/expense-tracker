import { fireEvent, screen } from '@testing-library/react';
import { visit } from 'src/testing-helpers/render-providers';

describe('Page | Todos | List page', () => {
  it('should render the todos page', async () => {
    await visit({ route: '/todos' });

    // Assert that the todo detail page is rendered
    expect(screen.getByText('common.loading')).toBeInTheDocument();
    expect(screen.queryByText('todos.title')).not.toBeInTheDocument();

    // Assert that the todos page is rendered
    expect(await screen.findByText('todos.title')).toBeInTheDocument();
    expect(screen.queryByText('common.loading')).not.toBeInTheDocument();

    expect(screen.getByTestId('todos-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('todo-data-row')).toHaveLength(5);

    fireEvent.click(screen.getByText('todos.new'));

    expect(await screen.findByTestId('todo-form')).toBeInTheDocument();
  });

  it('should redirect the user to the todo detail page on clicking the todo item', async () => {
    await visit({ route: '/todos' });
    expect(await screen.findByText('todos.title')).toBeInTheDocument();

    fireEvent.click(screen.getAllByTestId('todo-data-row')[0]);

    expect(await screen.findByTestId('todo-detail-page')).toBeInTheDocument();
  });
});
