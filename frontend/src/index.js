import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      preventDuplicate
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SnackbarProvider>
  </>
);
