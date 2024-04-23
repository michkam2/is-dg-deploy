<template>
  <DeleteConfirmationDialog v-model="isDeleteDialogOpened" :loading="isDeleteInProgress" @on-submit="deleteScenario">
    <template #title>{{ t('scenario.delete_scenario') }}</template>
    <template #description>{{ t('scenario.delete_scenario_desc') }}</template>
  </DeleteConfirmationDialog>
</template>

<script setup lang="ts">
import { handleError } from '@/utils/error-handler';
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';
import DeleteConfirmationDialog from '@/components/core/DeleteConfirmationDialog.vue';
import { Scenario } from '@/models/Scenario';
import ScenarioService from '@/services/ScenarioService';

const isDeleteDialogOpened = defineModel<boolean>();
const props = defineProps({
  scenario: {
    type: Object as PropType<Scenario>,
    required: true,
  },
});
const emit = defineEmits(['onDeleted']);

const { t } = useI18n();

const isDeleteInProgress = ref(false);
async function deleteScenario() {
  try {
    isDeleteInProgress.value = true;
    console.log(props.scenario.id);
    await ScenarioService.deleteScenario(props.scenario.id);
    isDeleteDialogOpened.value = false;
    emit('onDeleted');
    toast.success(t('scenario.toasts.delete_success'));
  } catch (error) {
    handleError(error, t('scenario.toasts.delete_failed'));
  } finally {
    isDeleteInProgress.value = false;
  }
}
</script>
