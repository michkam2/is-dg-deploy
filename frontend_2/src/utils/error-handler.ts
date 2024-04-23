import { ErrorResponse } from '@/models/ErrorResponse';
import { FetchError } from 'ofetch';
import { toast } from 'vue3-toastify';
import { useAuthStore } from '@/stores/auth-store';

const ignoreErrorMessages = [
  'There are not any commands in the database!',
  'There are not any recipes in the database yet!',
];

function handleError(error: unknown, defaultErrorMessage: string): unknown {
  let message = defaultErrorMessage;

  const authStore = useAuthStore();

  if (error instanceof FetchError) {
    const errorData = error.response?._data;
    if (errorData && typeof errorData === 'object' && 'errors' in errorData) {
      const errorResponse = errorData as ErrorResponse;
      message = errorResponse.errors?.[0] ?? defaultErrorMessage;
      if (ignoreErrorMessages.includes(message)) {
        message = '';
      }
    }
    if (!errorData && error.response?.status === 403 && authStore.isTokenExpired()) {
      message = '';
      return error;
    }
  }

  if (message.length > 0) {
    toast.error(message);
  } else {
    console.error(error);
  }

  return error;
}

export { handleError };
