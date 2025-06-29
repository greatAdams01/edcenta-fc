import { ApolloError, ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { getCookie } from 'cookies-next';
import { handleError, AppError, ErrorCode, requiresAuth } from './errors';
import { showErrorToast, showAuthErrorToast } from './toast';

// Error link for handling GraphQL and network errors
export const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      // Handle GraphQL errors
      const errorCode = extensions?.code as ErrorCode;
      const appError = new AppError(
        message,
        errorCode || ErrorCode.SERVER_ERROR,
        'MEDIUM' as any
      );

      // Log error for debugging
      console.error('GraphQL Error:', {
        message,
        locations,
        path,
        code: errorCode,
        operation: operation.operationName
      });

      // Show appropriate toast based on error type
      if (requiresAuth(appError)) {
        showAuthErrorToast(appError.userMessage);
        // Clear tokens but don't redirect here - let components handle redirects
        if (typeof window !== 'undefined') {
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'Authdata=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
      } else {
        showErrorToast(appError);
      }
    });
  }

  if (networkError) {
    // Handle network errors
    console.error('Network Error:', networkError);
    
    let errorMessage = 'Network error occurred';
    let errorCode = ErrorCode.SERVER_ERROR;

    if ('statusCode' in networkError) {
      const statusCode = (networkError as any).statusCode;
      
      switch (statusCode) {
        case 401:
          errorMessage = 'Authentication required';
          errorCode = ErrorCode.NOT_AUTHORIZED;
          // Clear tokens for auth errors
          if (typeof window !== 'undefined') {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'Authdata=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          }
          break;
        case 403:
          errorMessage = 'Access denied';
          errorCode = ErrorCode.NOT_AUTHORIZED;
          break;
        case 404:
          errorMessage = 'Resource not found';
          errorCode = ErrorCode.CONTENT_NOT_FOUND;
          break;
        case 429:
          errorMessage = 'Too many requests';
          errorCode = ErrorCode.RATE_LIMIT_EXCEEDED;
          break;
        case 500:
          errorMessage = 'Server error';
          errorCode = ErrorCode.SERVER_ERROR;
          break;
        default:
          errorMessage = 'Network error';
          errorCode = ErrorCode.SERVICE_UNAVAILABLE;
      }
    }

    const appError = new AppError(errorMessage, errorCode);
    showErrorToast(appError);
  }
});

// Auth link for adding authentication headers
export const authLink = setContext((_, { headers }) => {
  const token = getCookie('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// HTTP link configuration
export const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080/graphql',
});

// Create Apollo Client with error handling
export const createApolloClient = () => {
  return new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
};

// Utility function to handle mutation errors
export const handleMutationError = (
  error: ApolloError,
  fallbackMessage: string = 'Operation failed'
): void => {
  const appError = handleError(error, fallbackMessage);
  showErrorToast(appError);
};

// Utility function to handle query errors
export const handleQueryError = (
  error: ApolloError,
  fallbackMessage: string = 'Failed to load data'
): void => {
  const appError = handleError(error, fallbackMessage);
  showErrorToast(appError);
};

// Hook for handling Apollo errors in components
export const useApolloErrorHandler = () => {
  const processApolloError = (error: ApolloError, fallbackMessage?: string): AppError => {
    const appError = handleError(error, fallbackMessage || 'An error occurred');
    showErrorToast(appError);
    return appError;
  };

  const processAuthError = (error: ApolloError): AppError => {
    const appError = handleError(error, 'Authentication failed');
    if (requiresAuth(appError)) {
      showAuthErrorToast();
      // Clear tokens but don't redirect - let components handle redirects
      if (typeof window !== 'undefined') {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'Authdata=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }
    return appError;
  };

  return {
    handleError: processApolloError,
    handleAuthError: processAuthError,
  };
}; 