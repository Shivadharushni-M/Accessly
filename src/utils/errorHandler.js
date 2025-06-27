import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export class AppError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export const errorHandler = {
  handle: (error) => {
    const { t } = useTranslation();
    if (error instanceof AppError) {
      // Handle specific application errors
      switch (error.code) {
        case 'UNAUTHORIZED':
          toast.error(t('You are not authorized'));
          // Redirect to login
          break;
        case 'VALIDATION_ERROR':
          toast.error(t('Validation failed'));
          break;
        default:
          toast.error(t(error.message));
      }
    } else if (error.response) {
      // Handle API errors
      switch (error.response.status) {
        case 400:
          toast.error(t('Bad Request'));
          break;
        case 401:
          toast.error(t('Unauthorized'));
          break;
        case 403:
          toast.error(t('Forbidden'));
          break;
        case 404:
          toast.error(t('Not Found'));
          break;
        case 500:
          toast.error(t('Server Error'));
          break;
        default:
          toast.error(t('An unexpected error occurred'));
      }
    } else {
      // Handle network errors
      toast.error(t('Network Error'));
    }

    // Log error for debugging
    console.error('Error:', error);
  },

  // Centralized error boundary
  ErrorBoundary: class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      errorHandler.handle(error);
    }

    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }

      return this.props.children;
    }
  }
};