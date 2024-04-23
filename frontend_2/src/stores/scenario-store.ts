import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import { Scenario, ScenarioFrame } from '@/models/Scenario';
import ScenarioService from '@/services/ScenarioService';

export const useScenarioStore = defineStore('scenarios', () => {
  const { t } = useI18n();
  const scenarios = ref<Scenario[]>([]);
  const isLoadingScenarios = ref(false);

  async function getScenarios() {
    try {
      isLoadingScenarios.value = true;
      scenarios.value = await ScenarioService.getScenarios();
    } catch (error) {
      console.log(error);
      toast.error(t('recipe.toasts.load_failed'));
    } finally {
      isLoadingScenarios.value = false;
    }
  }

  async function getActiveScenarios() {
    try {
      isLoadingScenarios.value = true;
      scenarios.value = await ScenarioService.getActiveScenarios();
    } catch (error) {
      console.log(error);
      toast.error(t('recipe.toasts.load_failed'));
    } finally {
      isLoadingScenarios.value = false;
    }
  }
  const scenarioFrame = ref<ScenarioFrame>({
    rules: ' ',
    name: '',
    devices: [],
    deactivated: false,
    isAlreadyTriggered: false,
    mutedUntil: 0,
    activeAtDay: [],
    activeAtHour: [],
  });
  const isCreatingScenario = ref(false);
  async function createScenario() {
    try {
      isCreatingScenario.value = true;
      scenarioFrame.value.name.trim;
      await ScenarioService.createScenario(scenarioFrame.value);
      toast.success(t('scenario.toasts.create_success'));
    } catch (error) {
      console.log(error);
      toast.error(t('scenario.toasts.create_failed'));
    } finally {
      isCreatingScenario.value = false;
    }
  }

  return {
    scenarios,
    isLoadingScenarios,
    scenarioFrame,
    getScenarios,
    createScenario,
    getActiveScenarios,
  };
});
