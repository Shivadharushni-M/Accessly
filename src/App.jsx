import { BrowserRouter } from 'react-router-dom';
import KeyboardShortcuts from './components/atoms/KeyboardShortcuts';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes/index.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <KeyboardShortcuts />
      <ErrorBoundary>
        <AppRoutes />
        <ToastContainer />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;