import { Todo } from './interfaces/todo';

const baseURL = 'https://jsonplaceholder.typicode.com/todos';

export const getTodos = async () => {
  const response = await fetch(`${baseURL}?_limit=10`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: Todo[] = await response.json();
  return data;
};

export const getTodo = async (id: string) => {
  const response = await fetch(`${baseURL}/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

export const createTodo = (todo: Todo) => Promise.resolve(todo);
// fetchService.post<Todo>({ url: baseURL, body: todo }).then((res) => res.data);

export const updateTodo = (todo: Todo) => Promise.resolve(todo);
// fetchService
//   .put<Todo>({
//     url: `${baseURL}/${todo.id}`,
//     body: todo,
//   })
//   .then((res) => res.data);
