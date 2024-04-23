<template>
  <dialog-common
    v-model="isDialogOpen"
    :action-label="t('global.create')"
    :loading="creatingCommand"
    @on-submit="createCommand"
  >
    <template #title>{{ t('command.create_command') }}</template>
    <template #default>
      <CommandForm ref="commandForm" v-model="command" />
    </template>
  </dialog-common>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommandService from '@/services/CommandService';
import { handleError } from '@/utils/error-handler';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import DialogCommon from '@/components/core/DialogCommon.vue';
import CommandForm from '@/components/commands/CommandForm.vue';
import { CommandInput } from '@/models/Command';

const isDialogOpen = defineModel<boolean>();
const emit = defineEmits(['onCreate']);

const { t } = useI18n();

const getDefaultCommand = (): CommandInput => ({
  name: '',
  deviceType: undefined,
  params: [],
});

const creatingCommand = ref(false);
const command = ref<CommandInput>(getDefaultCommand());
const commandForm = ref();

async function createCommand() {
  if (!commandForm.value?.validate()) {
    return;
  }

  try {
    creatingCommand.value = true;
    await CommandService.createCommand(command.value);
    command.value = getDefaultCommand();
    isDialogOpen.value = false;
    emit('onCreate');
    toast.success(t('command.toasts.create_success'));
  } catch (error) {
    handleError(error, t('command.toasts.create_failed'));
  } finally {
    creatingCommand.value = false;
  }
}
</script>

<style lang="scss" scoped></style>
