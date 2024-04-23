import { FetchContext, ofetch } from 'ofetch';
import { useAuthStore } from '@/stores/auth-store';

async function onResponseError(context: FetchContext) {
  const { response } = context;
  const authStore = useAuthStore();

  if (!response) return;

  if (response.status === 403 && authStore.isTokenExpired()) {
    console.error('Token expired');
    authStore.logout();
  }
}

function onRequest(context: FetchContext) {
  const { options } = context;
  const authStore = useAuthStore();

  if (authStore.jwt) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${authStore.jwt}`,
    };
  }
}

const api = ofetch.create({
  baseURL: process.env.API_URL || '/api',
  onResponseError,
  onRequest,
});

export { api };
