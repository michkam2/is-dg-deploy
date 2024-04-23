<template>
  <dialog-common
    v-model="isDialogOpen"
    :action-label="t('global.save')"
    :loading="updatingCommand"
    @on-submit="updateCommand"
  >
    <template #title>{{ t('command.edit_command') }}</template>
    <template #default>
      <CommandForm ref="commandForm" v-model="commandInput" />
    </template>
  </dialog-common>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { handleError } from '@/utils/error-handler';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import DialogCommon from '@/components/core/DialogCommon.vue';
import CommandService from '@/services/CommandService';
import { Command, CommandInput } from '@/models/Command';
import CommandForm from './CommandForm.vue';
import { toRaw } from 'vue';

const isDialogOpen = defineModel<boolean>();
const props = defineProps({
  command: {
    type: Object as PropType<Command>,
    required: true,
  },
});
const emit = defineEmits(['onUpdate']);

const { t } = useI18n();

const commandClone = (command: Command) => structuredClone(toRaw(command));

const updatingCommand = ref(false);
const commandInput = ref<CommandInput>(commandClone(props.command));
const commandForm = ref();

async function updateCommand() {
  if (!commandForm.value?.validate()) {
    return;
  }

  try {
    updatingCommand.value = true;
    const updateCommand = commandInput.value;

    if (updateCommand.deviceType === props.command.deviceType) {
      delete updateCommand.deviceType;
    }

    await CommandService.updateCommand(updateCommand, props.command.id);
    isDialogOpen.value = false;
    emit('onUpdate');
    toast.success(t('command.toasts.update_success'));
  } catch (error) {
    handleError(error, t('command.toasts.update_failed'));
  } finally {
    updatingCommand.value = false;
  }
}

watch(
  () => props.command,
  (command) => {
    commandInput.value = commandClone(command);
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped></style>
