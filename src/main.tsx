
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx'
import './index.css'

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Get the root element
const rootElement = document.getElementById("root");

// Make sure the root element exists
if (!rootElement) throw new Error('Root element not found');

// Create root and render with Router at the top level
const root = createRoot(rootElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <App />
    </Router>
  </QueryClientProvider>
);
