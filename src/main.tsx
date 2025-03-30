
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx'
import './index.css'

// Get the root element
const rootElement = document.getElementById("root");

// Make sure the root element exists
if (!rootElement) throw new Error('Root element not found');

// Create root and render with Router at the top level
const root = createRoot(rootElement);
root.render(
  <Router>
    <App />
  </Router>
);
