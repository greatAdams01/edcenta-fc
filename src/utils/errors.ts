// Error codes that match the backend ErrorCode enum
export enum ErrorCode {
  // Authentication errors
  AUTH_ERROR = 'AUTH_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_EMAIL = 'INVALID_EMAIL',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  CAST_ERROR = 'CAST_ERROR',
  DUPLICATE_KEY = 'DUPLICATE_KEY',
  
  // Business logic errors
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  CONTENT_NOT_FOUND = 'CONTENT_NOT_FOUND',
  
  // External service errors
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  EMAIL_ERROR = 'EMAIL_ERROR',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  
  // System errors
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// User-friendly error messages
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Authentication errors
  [ErrorCode.AUTH_ERROR]: 'Authentication failed. Please log in again.',
  [ErrorCode.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ErrorCode.INVALID_TOKEN]: 'Invalid session. Please log in again.',
  [ErrorCode.USER_NOT_FOUND]: 'User not found.',
  [ErrorCode.NOT_AUTHORIZED]: 'You are not authorized to perform this action.',
  
  // Validation errors
  [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorCode.INVALID_EMAIL]: 'Please enter a valid email address.',
  [ErrorCode.WEAK_PASSWORD]: 'Password is too weak. Please use a stronger password.',
  [ErrorCode.INVALID_INPUT]: 'Invalid input provided.',
  
  // Database errors
  [ErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again.',
  [ErrorCode.CAST_ERROR]: 'Invalid data format provided.',
  [ErrorCode.DUPLICATE_KEY]: 'This item already exists.',
  
  // Business logic errors
  [ErrorCode.INSUFFICIENT_FUNDS]: 'Insufficient funds for this operation.',
  [ErrorCode.SUBSCRIPTION_EXPIRED]: 'Your subscription has expired. Please renew to continue.',
  [ErrorCode.CONTENT_NOT_FOUND]: 'The requested content was not found.',
  
  // External service errors
  [ErrorCode.PAYMENT_ERROR]: 'Payment processing failed. Please try again.',
  [ErrorCode.EMAIL_ERROR]: 'Email service is temporarily unavailable.',
  [ErrorCode.FILE_UPLOAD_ERROR]: 'File upload failed. Please try again.',
  
  // System errors
  [ErrorCode.SERVER_ERROR]: 'A server error occurred. Please try again later.',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment and try again.',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable. Please try again later.'
};

// Error categories for different UI treatments
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  NETWORK = 'network',
  BUSINESS = 'business',
  SYSTEM = 'system'
}

const ERROR_CATEGORIES: Record<ErrorCode, ErrorCategory> = {
  // Authentication errors
  [ErrorCode.AUTH_ERROR]: ErrorCategory.AUTHENTICATION,
  [ErrorCode.TOKEN_EXPIRED]: ErrorCategory.AUTHENTICATION,
  [ErrorCode.INVALID_TOKEN]: ErrorCategory.AUTHENTICATION,
  [ErrorCode.USER_NOT_FOUND]: ErrorCategory.AUTHENTICATION,
  [ErrorCode.NOT_AUTHORIZED]: ErrorCategory.AUTHENTICATION,
  
  // Validation errors
  [ErrorCode.VALIDATION_ERROR]: ErrorCategory.VALIDATION,
  [ErrorCode.INVALID_EMAIL]: ErrorCategory.VALIDATION,
  [ErrorCode.WEAK_PASSWORD]: ErrorCategory.VALIDATION,
  [ErrorCode.INVALID_INPUT]: ErrorCategory.VALIDATION,
  
  // Database errors
  [ErrorCode.DATABASE_ERROR]: ErrorCategory.SYSTEM,
  [ErrorCode.CAST_ERROR]: ErrorCategory.VALIDATION,
  [ErrorCode.DUPLICATE_KEY]: ErrorCategory.VALIDATION,
  
  // Business logic errors
  [ErrorCode.INSUFFICIENT_FUNDS]: ErrorCategory.BUSINESS,
  [ErrorCode.SUBSCRIPTION_EXPIRED]: ErrorCategory.BUSINESS,
  [ErrorCode.CONTENT_NOT_FOUND]: ErrorCategory.BUSINESS,
  
  // External service errors
  [ErrorCode.PAYMENT_ERROR]: ErrorCategory.BUSINESS,
  [ErrorCode.EMAIL_ERROR]: ErrorCategory.NETWORK,
  [ErrorCode.FILE_UPLOAD_ERROR]: ErrorCategory.NETWORK,
  
  // System errors
  [ErrorCode.SERVER_ERROR]: ErrorCategory.SYSTEM,
  [ErrorCode.RATE_LIMIT_EXCEEDED]: ErrorCategory.NETWORK,
  [ErrorCode.SERVICE_UNAVAILABLE]: ErrorCategory.NETWORK
};

// Custom error class
export class AppError extends Error {
  public code: ErrorCode;
  public severity: ErrorSeverity;
  public category: ErrorCategory;
  public timestamp: Date;
  public context?: any;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.SERVER_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.category = ERROR_CATEGORIES[code];
    this.timestamp = new Date();
    this.context = context;
  }

  get userMessage(): string {
    return ERROR_MESSAGES[this.code] || this.message;
  }
}

// Error handler function
export const handleError = (
  error: any,
  fallbackMessage: string = 'An unexpected error occurred'
): AppError => {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }

  // Handle GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    const code = graphQLError.extensions?.code as ErrorCode;
    
    if (code && Object.values(ErrorCode).includes(code)) {
      return new AppError(
        graphQLError.message,
        code,
        ErrorSeverity.MEDIUM,
        { graphQLError }
      );
    }
  }

  // Handle network errors
  if (error.networkError) {
    if (error.networkError.statusCode === 401) {
      return new AppError(
        'Authentication required',
        ErrorCode.NOT_AUTHORIZED,
        ErrorSeverity.HIGH
      );
    }
    if (error.networkError.statusCode === 403) {
      return new AppError(
        'Access denied',
        ErrorCode.NOT_AUTHORIZED,
        ErrorSeverity.HIGH
      );
    }
    if (error.networkError.statusCode === 404) {
      return new AppError(
        'Resource not found',
        ErrorCode.CONTENT_NOT_FOUND,
        ErrorSeverity.MEDIUM
      );
    }
    if (error.networkError.statusCode >= 500) {
      return new AppError(
        'Server error',
        ErrorCode.SERVER_ERROR,
        ErrorSeverity.HIGH
      );
    }
  }

  // Handle validation errors from backend
  if (error.message && error.message.includes('validation')) {
    return new AppError(
      error.message,
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM
    );
  }

  // Handle duplicate key errors
  if (error.message && error.message.includes('duplicate')) {
    return new AppError(
      'This item already exists',
      ErrorCode.DUPLICATE_KEY,
      ErrorSeverity.MEDIUM
    );
  }

  // Default fallback
  return new AppError(
    fallbackMessage,
    ErrorCode.SERVER_ERROR,
    ErrorSeverity.MEDIUM,
    { originalError: error }
  );
};

// Error severity to toast type mapping
export const getToastType = (severity: ErrorSeverity): 'error' | 'warning' | 'info' => {
  switch (severity) {
    case ErrorSeverity.CRITICAL:
    case ErrorSeverity.HIGH:
      return 'error';
    case ErrorSeverity.MEDIUM:
      return 'warning';
    case ErrorSeverity.LOW:
      return 'info';
    default:
      return 'error';
  }
};

// Error category to action mapping
export const getErrorAction = (category: ErrorCategory): string | null => {
  switch (category) {
    case ErrorCategory.AUTHENTICATION:
      return 'Please log in again';
    case ErrorCategory.VALIDATION:
      return 'Please check your input';
    case ErrorCategory.BUSINESS:
      return 'Please try again';
    case ErrorCategory.NETWORK:
      return 'Please check your connection';
    case ErrorCategory.SYSTEM:
      return 'Please try again later';
    default:
      return null;
  }
};

// Utility function to check if error requires authentication
export const requiresAuth = (error: AppError): boolean => {
  return [
    ErrorCode.AUTH_ERROR,
    ErrorCode.TOKEN_EXPIRED,
    ErrorCode.INVALID_TOKEN,
    ErrorCode.NOT_AUTHORIZED
  ].includes(error.code);
};

// Utility function to check if error is retryable
export const isRetryable = (error: AppError): boolean => {
  return [
    ErrorCode.SERVER_ERROR,
    ErrorCode.SERVICE_UNAVAILABLE,
    ErrorCode.RATE_LIMIT_EXCEEDED
  ].includes(error.code);
};

// Error logging utility
export const logError = (error: AppError, context?: any): void => {
  console.error('Application Error:', {
    message: error.message,
    code: error.code,
    severity: error.severity,
    category: error.category,
    timestamp: error.timestamp,
    context: { ...error.context, ...context }
  });
}; 