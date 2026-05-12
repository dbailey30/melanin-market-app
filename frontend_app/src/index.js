import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import AppRouter from './AppRouter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
