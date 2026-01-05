import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import failOnConsole from 'jest-fail-on-console';
import { jestPreviewConfigure } from 'jest-preview';
import { fetch } from 'whatwg-fetch';
import './index.css';
import { mockServer } from 'src/testing-helpers';

expect.extend(toHaveNoViolations);
jestPreviewConfigure({ autoPreview: true });

failOnConsole({
  shouldFailOnError: true,
  shouldFailOnWarn: false,
});

jest.useFakeTimers();

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      // Return the same string that is passed to the function.
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Trans: ({ children }: any) => children,
}));

beforeAll(() => {
  if (!window.fetch) {
    window.fetch = fetch;
  }
  mockServer.listen();
});

afterAll(() => {
  mockServer.close();
  localStorage.clear();
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  mockServer.resetHandlers();
});
