import { handleError } from '@/utils/error-handler';
import { Ref, ref } from 'vue';

function useAsyncData<T = unknown>(cb: () => Promise<T>, errorMessage?: string, immediate = true) {
  const data: Ref<T | undefined> = ref();
  const error: Ref<Error | undefined> = ref();
  const isLoading: Ref<boolean> = ref(false);

  async function refresh() {
    try {
      isLoading.value = true;
      data.value = await cb();
    } catch (e) {
      error.value = e as Error;
      if (errorMessage) handleError(e, errorMessage);
    } finally {
      isLoading.value = false;
    }
  }
  if (immediate) refresh();

  return { data, error, isLoading, refresh };
}

export { useAsyncData };
