<template>
  <div>
    <q-card class="q-pa-lg shadow">
      <div class="row items-center q-col-gutter-x-xl q-col-gutter-y-md">
        <q-input
          ref="nameRef"
          v-model="recipe.name"
          :rules="nameRules"
          :disable="props.loading"
          :label="t('global.name')"
          class="col-12 col-lg-6"
        />
        <q-select
          ref="deviceTypeRef"
          v-model="recipe.deviceType"
          :rules="deviceTypeRules"
          :disable="props.loading"
          class="col-12 col-lg-6"
          :label="t('device.device_type')"
          :options="Object.values(DeviceTypeEnum)"
        />
        <q-checkbox
          v-model="recipe.subRecipe"
          :disable="props.loading"
          dense
          :label="t('recipe.subrecipe')"
          class="col-auto"
        />
      </div>
    </q-card>
    <q-btn-toggle
      v-model="selectedStepType"
      spread
      class="q-mb-lg q-mt-xl shadow custom-toggle"
      no-caps
      rounded
      unelevated
      toggle-color="primary"
      color="white"
      text-color="primary"
      :options="[
        { label: t('command.label', 2), value: 'commands' },
        { label: t('recipe.subrecipe', 2), value: 'subrecipes' },
      ]"
    />
    <CommandStepsSelect v-show="selectedStepType === 'commands'" v-model="recipe" :loading="props.loading" />
    <SubrecipeStepsSelect v-show="selectedStepType === 'subrecipes'" v-model="recipe" :loading="props.loading" />
  </div>
</template>

<script setup lang="ts">
import { RecipeInput, getEmptyRecipeInput } from '@/models/Recipe';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DeviceTypeEnum from '@/models/DeviceType';
import { isFormValid } from '@/utils/form-validation';
import CommandStepsSelect from '@/components/recipes/CommandStepsSelect.vue';
import SubrecipeStepsSelect from './SubrecipeStepsSelect.vue';

const recipe = defineModel<RecipeInput>({ required: true, default: getEmptyRecipeInput() });
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
defineExpose({ validate });

const { t } = useI18n();

const selectedStepType = ref('commands');

const nameRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];
const deviceTypeRules = [(val: string) => (val && val.length > 0) || t('global.rules.required')];

const nameRef = ref();
const deviceTypeRef = ref();

function validate() {
  const refs = [nameRef.value, deviceTypeRef.value];
  return isFormValid(refs);
}
</script>

<style lang="scss" scoped>
.custom-toggle {
  border: 1px solid var(--q-primary);
}
</style>
