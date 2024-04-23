<template>
  <DeleteConfirmationDialog v-model="isDialogOpen" :loading="isDeleteInProgress" @on-submit="handleDelete">
    <template #title>{{ t('command.delete_command') }}</template>
    <template #description>{{ t('command.delete_command_desc') }}</template>
  </DeleteConfirmationDialog>
</template>

<script setup lang="ts">
import { handleError } from '@/utils/error-handler';
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';
import DeleteConfirmationDialog from '@/components/core/DeleteConfirmationDialog.vue';
import { Command } from '@/models/Command';
import CommandService from '@/services/CommandService';

const isDialogOpen = defineModel<boolean>();
const props = defineProps({
  command: {
    type: Object as PropType<Command>,
    required: true,
  },
});
const emit = defineEmits(['onDeleted']);

const { t } = useI18n();

const isDeleteInProgress = ref(false);
async function handleDelete() {
  try {
    isDeleteInProgress.value = true;
    await CommandService.deleteCommand(props.command.id);
    isDialogOpen.value = false;
    emit('onDeleted');
    toast.success(t('command.toasts.delete_success'));
  } catch (error) {
    handleError(error, t('command.toasts.delete_failed'));
  } finally {
    isDeleteInProgress.value = false;
  }
}
</script>
