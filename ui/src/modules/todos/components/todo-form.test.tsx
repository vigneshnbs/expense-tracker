import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { renderProviderWrapper } from 'src/testing-helpers';
import { TodoForm } from './todo-form';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('Component | TodoForm', () => {
  it('should render the form fields', async () => {
    const wrapper = renderProviderWrapper();
    render(
      <BrowserRouter>
        <TodoForm />
      </BrowserRouter>,
      { wrapper },
    );

    const todoTitleInput = screen.getByPlaceholderText('Enter a title');
    screen.getAllByText('todos.todoForm.title');
    expect(todoTitleInput).toHaveValue('');
    expect(screen.getByLabelText('todos.todoForm.completed')).not.toBeChecked();

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveTextContent('common.save');

    fireEvent.change(todoTitleInput, {
      target: { value: 'Test todo' },
    });
    expect(todoTitleInput).toHaveValue('Test todo');
    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('should call createMutate when submitting the form with valid data', async () => {
    const wrapper = renderProviderWrapper();
    render(
      <BrowserRouter>
        <TodoForm />
      </BrowserRouter>,
      { wrapper },
    );

    fireEvent.change(screen.getByPlaceholderText('Enter a title'), {
      target: { value: 'Test Todo' },
    });
    await waitFor(() =>
      expect(screen.getByTestId('submit-button')).toBeEnabled(),
    );
    fireEvent.click(screen.getByTestId('submit-button'));

    await screen.findByText('todos.todoForm.createSuccess');
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/todos'));
  });

  it('should call updateMutate when submitting the form when todo is already passed as prop', async () => {
    const todo = {
      title: 'some title',
      userId: 1,
      id: '1234',
      completed: true,
    };

    const wrapper = renderProviderWrapper();
    render(
      <BrowserRouter>
        <TodoForm todo={todo} />
      </BrowserRouter>,
      { wrapper },
    );

    fireEvent.change(screen.getByPlaceholderText('Enter a title'), {
      target: { value: 'New title' },
    });
    await waitFor(() =>
      expect(screen.getByTestId('submit-button')).toBeEnabled(),
    );
    fireEvent.click(screen.getByTestId('submit-button'));

    await screen.findByText('todos.todoForm.updateSuccess');
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/todos'));
  });
});
