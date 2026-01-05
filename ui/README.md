# React + TypeScript + Vite

This is an internal template that provides a minimal setup to get React working in Vite with HMR and some ESLint rules. It also has Jest configured with a mock server to mock APIs.

# Pre-requisites

| Requirement | Version            |
| ----------- | ------------------ |
| Node.js     | 20+                |
| pnpm        | 9+                 |
| Code Editor | VSCode (Suggested) |

# Repo set up and commands

Install packages:

```sh
pnpm install
```

Start dev server:

```sh
pnpm start
```

Run Tests Locally

```sh
pnpm test
```

Run Tests with Coverage

```sh
pnpm test:ci
```

## Technologies and Libraries used

Package manager: PNPM

| Feature                     | Technology used                |
| --------------------------- | ------------------------------ |
| Basic linting               | Eslint                         |
| Code formatting             | Prettier                       |
| Pre-commit hook validator   | Husky                          |
| Lint git commit subject     | CommitLint                     |
| Lint only staged files      | lint-staged                    |
| Package bundler             | Vite                           |
| Programming language        | Typescript                     |
| FE Framework                | React                          |
| Styling                     | Styled components              |
| Unit test suite             | Jest, React-testing-library    |
| Internationalization (i18n) | i18next, react-i18next         |
| Routing                     | React Router, React Router DOM |
| Component Library           | @mui/material                  |
| Data Fetching and Caching   | @tanstack/react-query          |
| Mock Server                 | msw                            |

# Test Helpers Usage Guide

Guide provides instructions on how to use the custom test helpers provided in `testing-helpers/render-providers.tsx` for writing tests in your project.

## Available Test Helpers

### `visit`

The `visit` helper is used to render the application at a specified route. It sets up the necessary providers like react query(For APIs) and ensures the page is rendered correctly with all the bells and whistles.

These tests are similar to acceptance or integration tests. We'll write these cases to verify the overall functionality, rather than focusing on minor logic like validations. The goal is to ensure that no major functionality is broken, essentially serving as a smoke test.

#### Usage

```typescript
import { visit } from 'src/testing-helpers';

describe('Page | some page', () => {
  it('should render the page with navigation links', async () => {
    await visit({ route: '/hello/world' });

    expect(screen.getByTestId('page-wrapper')).toBeInTheDocument();
    // Your assertions
  });
});
```

### `renderProviderWrapper`

The `renderProviderWrapper` helper is used to wrap components with the necessary providers for testing. This is useful when you need to test individual components that rely on context providers like react query(For APIs).

These tests are unit test cases where we will cover components individually by stubbing all other methods. This ensures that all lines of the components are covered.

#### Usage

```typescript
import { render, screen } from '@testing-library/react';
import { renderProviderWrapper } from 'src/testing-helpers';

describe('SomeComponent', () => {
  it('should render correctly', () => {
    const { wrapper } = renderProviderWrapper();

    render(<SomeComponent />, { wrapper });

    expect(screen.getByText('Some Text')).toBeInTheDocument();
  });
});
```

## Common assertions

### To assert translations

- We are stubbing the useTranslation hook globally in the [setupTests](/src/setupTests.ts) file. so in the test environment, it will render the translation key provided instead of the actual translation. so check whether the given key is rendered in the test

```typescript
import { fireEvent, render, screen } from '@testing-library/react';
import { renderProviderWrapper } from 'src/testing-helpers';

describe('SomeComponent', () => {
  it('should render correctly', () => {
    const { wrapper } = renderProviderWrapper();

    render(<SomeComponent />, { wrapper });

    expect(screen.getByTestId('submit-button')).toHaveTextContent('common.submit');;
  });
});
```

### To mock API calls

We are using the [msw](https://mswjs.io/) mock server to mock our APIs in the test environment.

- Add your API in the handlers present in the [mock-server](/src/testing-helpers/mock-server.ts) file and validate the component behaviour. Please do not stub the query hooks and validate it.
- All the mock objects should be placed in the mocks folder
- All the happy flows should be mocked here for the false flows we can mock in the individual test cases itself.

By following this guide, you can effectively utilize the custom test helpers to write more maintainable and readable tests in your project.

## Using the `useToast` Hook

The `useToast` hook provides a simple way to display toast notifications in your application.

```typescript
import { useToast } from 'src/hooks/useToast';

const { addSuccessToast, addErrorToast } = useToast();

const handleSuccess = () => {
  addSuccessToast('Operation successful!');
};

const handleError = () => {
  addErrorToast('An error occurred.');
};
```

By following these steps, you can easily use the `useToast` hook to display toast notifications in your React application.
