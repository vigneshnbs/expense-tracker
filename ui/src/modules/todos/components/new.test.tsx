import { render, screen } from '@testing-library/react';
import { NewTodo } from './new';

describe('Component | Todo | New', () => {
  it('should render the sample new component', async () => {
    render(<NewTodo />);
    expect(screen.getByText('todo.newPage.Content')).toBeInTheDocument();
  });
});
