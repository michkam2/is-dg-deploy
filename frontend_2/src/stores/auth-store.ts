import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { User, UserLogin } from '@/models/User';
import AuthService from '@/services/AuthService';
import { computed, nextTick, ref, watch } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { Role } from '@/models/Role';
import { JwtPayload } from '@/models/JwtPayload';
import { useStoreRouter } from '@/composables/useStoreRouter';

export const useAuthStore = defineStore('authStore', () => {
  const router = useStoreRouter();
  const jwt = useStorage('jwt', '');
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!jwt.value);

  async function login(user: UserLogin) {
    const res = await AuthService.login(user);
    jwt.value = res;
  }

  function clearJwt() {
    jwt.value = '';
  }

  function logout() {
    clearJwt();
    router.push('/login');
  }

  const decodeJwt = () => {
    if (!jwt.value) return null;
    try {
      const decodedToken = jwtDecode<JwtPayload>(jwt.value);
      return decodedToken;
    } catch (e) {
      logout();
      console.error('Invalid JWT');
      return null;
    }
  };

  async function getCurrentUser() {
    if (!userId.value) return null;
    const user = await AuthService.getUserById(userId.value);
    return user;
  }

  async function refreshUser() {
    user.value = await getCurrentUser();
  }

  const userId = computed(() => {
    const decodedToken = decodeJwt();
    if (!decodedToken) return null;
    return decodedToken.sub;
  });

  const isTokenExpired = () => {
    const decodedToken = decodeJwt();
    if (!decodedToken) return true;

    const currentTime = Date.now() / 1000; // Convert to seconds

    if (!decodedToken.exp) return true;

    return decodedToken.exp < currentTime;
  };

  const isAdmin = computed(() => {
    const decodedToken = decodeJwt();
    if (!decodedToken || !decodedToken.authorities) return false;

    const isAdmin = decodedToken.authorities.some((authority) => authority.authority === Role.ADMIN);
    return isAdmin;
  });

  watch(
    userId,
    async () => {
      await nextTick(); // Ensures the JWT is set before the user is fetched
      await refreshUser();
    },
    { immediate: true },
  );
  return {
    jwt,
    login,
    logout,
    isAuthenticated,
    isTokenExpired,
    user,
    userId,
    refreshUser,
    isAdmin,
    clearJwt,
  };
});
