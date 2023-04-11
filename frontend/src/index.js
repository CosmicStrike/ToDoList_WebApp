import ReactDOM from 'react-dom/client';
import App from './App'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from './Contexts/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      preventDuplicate
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </SnackbarProvider>
  </>
);
