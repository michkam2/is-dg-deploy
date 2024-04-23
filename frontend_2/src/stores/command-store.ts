import { defineStore } from 'pinia';
import { reactive } from 'vue';
import commandService from 'src/services/CommandService';
import { useAsyncData } from '@/composables/useAsyncData';
import { useI18n } from 'vue-i18n';
import { Command } from '@/models/Command';

export const useCommandStore = defineStore('command', () => {
  const { t } = useI18n();

  const commands = reactive(
    useAsyncData(() => commandService.getCommands('none', 'none'), t('command.toasts.load_failed'), false),
  );

  function getCommandById(id: string): Command | undefined {
    return commands.data?.find((command) => command.id === id);
  }

  return {
    commands,
    getCommandById,
  };
});
