import { toast, ToastContent, ToastOptions, Slide, Id } from "react-toastify";
import { AppError, ErrorCode, ErrorSeverity, handleError, getToastType, getErrorAction } from "./errors";

export const defaultToastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Slide,
};

type ToastType = "success" | "error" | "info" | "warning" | "default";

/**
 * Display toast
 *
 * @param {ToastType} type
 * @param {ToastContent} content
 * @param {ToastOptions} [options=defaultToastOption]
 * @return {Id}
 */
export const showToast = (
  type: ToastType,
  content: ToastContent,
  options: Partial<ToastOptions> = {},
): Id => {
  const optionsToApply = { ...defaultToastOptions, ...options };

  switch (type) {
    case "success":
      return toast.success(content, optionsToApply);
    case "error":
      return toast.error(content, optionsToApply);
    case "info":
      return toast.info(content, optionsToApply);
    case "warning":
      return toast.warn(content, optionsToApply);
    case "default":
      return toast(content, optionsToApply);
    default:
      return toast(content, optionsToApply);
  }
};

/**
 * Display error toast with enhanced error handling
 *
 * @param {any} error - The error to display
 * @param {string} [fallbackMessage] - Fallback message if error parsing fails
 * @param {ToastOptions} [options] - Toast options
 * @return {Id}
 */
export const showErrorToast = (
  error: any,
  fallbackMessage: string = 'An unexpected error occurred',
  options: Partial<ToastOptions> = {}
): Id => {
  const appError = handleError(error, fallbackMessage);
  const toastType = getToastType(appError.severity);
  const action = getErrorAction(appError.category);
  
  let message = appError.userMessage;
  if (action) {
    message = `${message} ${action}`;
  }

  // Log error for debugging
  console.error('Error Toast:', {
    message: appError.message,
    code: appError.code,
    severity: appError.severity,
    category: appError.category
  });

  return showToast(toastType, message, {
    ...options,
    autoClose: appError.severity === ErrorSeverity.CRITICAL ? false : 6000,
  });
};

/**
 * Display success toast
 *
 * @param {string} message - Success message
 * @param {ToastOptions} [options] - Toast options
 * @return {Id}
 */
export const showSuccessToast = (
  message: string,
  options: Partial<ToastOptions> = {}
): Id => {
  return showToast('success', message, {
    ...options,
    autoClose: 3000,
  });
};

/**
 * Display warning toast
 *
 * @param {string} message - Warning message
 * @param {ToastOptions} [options] - Toast options
 * @return {Id}
 */
export const showWarningToast = (
  message: string,
  options: Partial<ToastOptions> = {}
): Id => {
  return showToast('warning', message, {
    ...options,
    autoClose: 5000,
  });
};

/**
 * Display info toast
 *
 * @param {string} message - Info message
 * @param {ToastOptions} [options] - Toast options
 * @return {Id}
 */
export const showInfoToast = (
  message: string,
  options: Partial<ToastOptions> = {}
): Id => {
  return showToast('info', message, {
    ...options,
    autoClose: 4000,
  });
};

/**
 * Display authentication error toast
 *
 * @param {string} [message] - Custom message
 * @param {ToastOptions} [options] - Toast options
 * @return {Id}
 */
export const showAuthErrorToast = (
  message: string = 'Please log in to continue',
  options: Partial<ToastOptions> = {}
): Id => {
  return showToast('error', message, {
    ...options,
    autoClose: false,
  });
};

/**
 * Display validation error toast
 *
 * @param {string} message - Validation message
 * @param {ToastOptions} [options] - Toast options
 * @return {Id}
 */
export const showValidationErrorToast = (
  message: string,
  options: Partial<ToastOptions> = {}
): Id => {
  return showToast('warning', message, {
    ...options,
    autoClose: 5000,
  });
};

/**
 * Display network error toast
 *
 * @param {string} [message] - Custom message
 * @param {ToastOptions} [options] - Toast options
 * @return {Id}
 */
export const showNetworkErrorToast = (
  message: string = 'Network error. Please check your connection.',
  options: Partial<ToastOptions> = {}
): Id => {
  return showToast('error', message, {
    ...options,
    autoClose: 6000,
  });
};