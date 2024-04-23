<template>
  <div class="auth-bg">
    <div class="auth-container shadow">
      <h1>{{ t('auth.register.label') }}</h1>
      <div class="q-mt-md">
        <q-form>
          <q-input
            ref="nicknameRef"
            v-model="userRegister.name"
            :label="t('account.username')"
            type="text"
            lazy-rules
            :rules="nameRules"
          >
            <template #prepend>
              <q-icon :name="mdiAccount" />
            </template>
          </q-input>
          <q-input
            ref="mailRef"
            v-model="userRegister.mail"
            :label="t('account.email')"
            type="email"
            lazy-rules
            :rules="mailRules"
          >
            <template #prepend>
              <q-icon :name="mdiEmail" />
            </template>
          </q-input>
          <q-input
            ref="passwordRef"
            v-model="userRegister.password"
            :label="t('account.password')"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="passwordRules"
          >
            <template #prepend>
              <q-icon :name="mdiLock" />
            </template>
            <template #append>
              <q-icon :name="isPwd ? mdiEyeOff : mdiEye" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <q-btn
            class="q-my-md full-width"
            color="primary"
            :label="t('auth.register.register_btn')"
            type="submit"
            size="1rem"
            no-caps
            unelevated
            :loading="isSubmitting"
            @click.prevent="register"
          />
        </q-form>
        <div class="column items-center q-my-lg links">
          <div class="q-mb-md">
            <span>{{ t('auth.register.have_account') }}</span>
            <router-link to="/login" class="q-ml-sm">
              {{ t('auth.register.login') }}
            </router-link>
          </div>
          <language-select />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import authService from '@/services/AuthService';
import { UserRegister } from '@/models/User';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { QInput } from 'quasar';
import { handleError } from '@/utils/error-handler';
import { isFormValid } from '@/utils/form-validation';
import { Role } from '@/models/Role';
import LanguageSelect from '@/components/core/LanguageSelect.vue';
import { useI18n } from 'vue-i18n';
import { mdiAccount, mdiEmail, mdiEye, mdiEyeOff, mdiLock } from '@quasar/extras/mdi-v6';
import { useAuthStore } from '@/stores/auth-store';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const userRegister = ref<UserRegister>({
  name: '',
  mail: '',
  password: '',
});
const isPwd = ref(true);
const isSubmitting = ref(false);

//Form validation
const nicknameRef = ref<QInput>();
const mailRef = ref<QInput>();
const passwordRef = ref<QInput>();

const nameRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
const mailRules = [
  (val: string) => (val && val.length > 0) || t('global.rules.required'),
  (val: string) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(val) || t('auth.rules.email_invalid');
  },
];
const passwordRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];

async function register() {
  const form = [nicknameRef.value, mailRef.value, passwordRef.value];
  if (!isFormValid(form)) return;

  try {
    isSubmitting.value = true;
    authStore.clearJwt();
    await authService.register(userRegister.value, Role.ADMIN);
    toast.success(t('auth.register.toasts.register_success'));
    router.push('/');
  } catch (error) {
    handleError(error, t('auth.register.toasts.register_failed'));
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/css/auth.scss';
</style>
