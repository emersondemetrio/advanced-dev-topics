import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Initialize React app with TSX
console.log('DOM App initialized with React and TSX');

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
