import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';

export default boot(({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('locale') ?? 'en',
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);
});
