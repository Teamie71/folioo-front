import type { Preview } from '@storybook/nextjs-vite';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/store/useAuthStore';
import '../src/styles/globals.css';

// Create a client for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

// Zustand store initializer component
const StoreInitializer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize auth store for Storybook
    useAuthStore.getState().setSessionRestoreAttempted(true);
  }, []);

  return children;
};

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(StoreInitializer, {
          children: React.createElement(Story),
        }),
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
