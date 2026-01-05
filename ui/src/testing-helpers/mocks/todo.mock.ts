import { Todo } from 'src/modules/todos/interfaces/todo';

export const generateTodos = (count: number) => {
  const todos: Todo[] = [];
  for (let i = 0; i < count; i++) {
    todos.push({
      id: `${i + 1}`,
      userId: 1,
      title: `Todo ${i + 1}`,
      completed: i % 2 == 0,
    });
  }
  return todos;
};
