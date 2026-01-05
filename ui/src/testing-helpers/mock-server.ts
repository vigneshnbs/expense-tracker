import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { generateTodos } from './mocks/todo.mock';

const handlers = [
  http.post(
    'https://jsonplaceholder.typicode.com/todos',
    async ({ request }) => {
      const newTodo = await request.json();
      return HttpResponse.json(newTodo, { status: 201 });
    },
  ),
  http.put(
    'https://jsonplaceholder.typicode.com/todos/:id',
    async ({ request }) => {
      const updatedTodo = await request.json();
      return HttpResponse.json(updatedTodo, { status: 200 });
    },
  ),
  http.get(
    'https://jsonplaceholder.typicode.com/todos',
    async (/*{ request } */) => {
      // const url = new URL(request.url);
      // const limit = url.searchParams.get('_limit');
      await delay();
      return HttpResponse.json(generateTodos(5));
    },
  ),
  http.get(
    'https://jsonplaceholder.typicode.com/todos/:id',
    async ({ params }) => {
      const { id } = params;
      await delay();
      return HttpResponse.json({
        title: 'Test title',
        userId: 1,
        id,
        completed: true,
      });
    },
  ),
];

export const mockServer = setupServer(...handlers);
