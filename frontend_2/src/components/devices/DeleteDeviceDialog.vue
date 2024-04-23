<template>
  <DeleteConfirmationDialog v-model="isDialogOpen" :loading="isDeleteInProgress" @on-submit="handleDelete">
    <template #title>{{ t('device.delete_device') }}</template>
    <template #description>{{ t('device.delete_device_desc') }}</template>
  </DeleteConfirmationDialog>
</template>

<script setup lang="ts">
import { handleError } from '@/utils/error-handler';
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';
import DeleteConfirmationDialog from '../core/DeleteConfirmationDialog.vue';
import { Device } from '@/models/Device';
import DeviceService from '@/services/DeviceService';

const isDialogOpen = defineModel<boolean>();
const props = defineProps({
  device: {
    type: Object as PropType<Device>,
    required: true,
  },
});
const emit = defineEmits(['onDeleted']);

const { t } = useI18n();

const isDeleteInProgress = ref(false);
async function handleDelete() {
  try {
    isDeleteInProgress.value = true;
    await DeviceService.deleteDevice(props.device.uid);
    isDialogOpen.value = false;
    emit('onDeleted');
    toast.success(t('device.toasts.delete_success'));
  } catch (error) {
    handleError(error, t('device.toasts.delete_failed'));
  } finally {
    isDeleteInProgress.value = false;
  }
}
</script>
