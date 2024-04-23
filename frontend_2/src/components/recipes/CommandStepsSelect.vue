<template>
  <div class="row q-col-gutter-xl">
    <div class="col-12 col-md-6">
      <div class="table-name text-secondary">{{ t('recipe.recipe_steps') }}</div>
      <VueDraggable v-model="localRecipeCommands" :animation="200" handle=".handle" draggable="tr" target="tbody">
        <q-table
          :rows="localRecipeCommands"
          :columns="stepColumns"
          flat
          :no-data-label="t('recipe.no_commands_added')"
          :loading-label="t('table.loading_label')"
          :rows-per-page-label="t('table.rows_per_page_label')"
          :rows-per-page-options="[0, 20, 50, 100]"
          hide-pagination
          class="shadow"
        >
          <template #header-cell-drag="propsDrag">
            <q-th auto-width :props="propsDrag" class="drag-th" />
          </template>

          <template #body-cell-drag="propsDrag">
            <q-td auto-width :props="propsDrag">
              <div>
                <q-icon :name="mdiDrag" size="28px" class="handle drag-icon" />
              </div>
            </q-td>
          </template>

          <template #body-cell-step="propsStep">
            <q-td auto-width :props="propsStep">
              <div>{{ propsStep.rowIndex + 1 }}</div>
            </q-td>
          </template>

          <template #body-cell-remove="propsRemove">
            <q-td auto-width :props="propsRemove">
              <div>
                <q-btn
                  dense
                  :icon="mdiClose"
                  color="red"
                  flat
                  round
                  :disable="props.loading"
                  @click="removeCommandFromRecipe(propsRemove.rowIndex)"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </VueDraggable>
    </div>
    <div class="col-12 col-md-6">
      <div class="table-name text-secondary">{{ t('recipe.available_commands') }}</div>
      <q-table
        :rows="filteredCommands"
        :columns="availableCommandsColumns"
        :loading="commandStore.commands.isLoading"
        flat
        :no-data-label="t('recipe.no_commands_for_device_type')"
        :loading-label="t('table.loading_label')"
        :rows-per-page-label="t('table.rows_per_page_label')"
        :rows-per-page-options="[20, 50, 100, 0]"
        class="shadow"
      >
        <template #body-cell-actions="propsActions">
          <q-td auto-width :props="propsActions">
            <q-btn
              :disable="props.loading"
              dense
              :icon="mdiPlus"
              color="primary"
              flat
              round
              @click="addCommandToRecipe(propsActions.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RecipeInput } from '@/models/Recipe';
import { QTableProps } from 'quasar';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Command } from '@/models/Command';
import { mdiPlus, mdiClose, mdiDrag } from '@quasar/extras/mdi-v6';
import { VueDraggable } from 'vue-draggable-plus';
import { useCommandStore } from '@/stores/command-store';

const recipe = defineModel<RecipeInput>({ required: true });
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const commandStore = useCommandStore();
commandStore.commands.refresh();

const localRecipeCommands = ref(recipe.value.commands?.map((c, index) => ({ id: index, value: c })) ?? []);

const filteredCommands = computed<Command[]>(() => {
  const { deviceType } = recipe.value;
  return commandStore.commands.data?.filter((command) => !deviceType || command.deviceType === deviceType) ?? [];
});

function addCommandToRecipe(command: Command) {
  const uniqueId = Date.now() + Math.random();
  localRecipeCommands.value.push({ id: uniqueId, value: command });
}

function removeCommandFromRecipe(index: number) {
  localRecipeCommands.value.splice(index, 1);
}

watch(
  localRecipeCommands,
  (newLocalCommands) => {
    recipe.value.commands = newLocalCommands.map((item) => item.value);
  },
  { deep: true },
);

const stepColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'drag',
    label: '',
    field: '',
    sortable: false,
    align: 'center',
  },
  {
    name: 'command',
    label: t('command.label'),
    field: (row) => row.value.name,
    sortable: false,
    align: 'left',
  },
  {
    name: 'remove',
    label: '',
    field: '',
    sortable: false,
    align: 'center',
  },
]);

const availableCommandsColumns = computed<QTableProps['columns']>(() => [
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'parameters',
    label: t('command.parameters'),
    field: 'params',
    sortable: false,
    align: 'left',
    format: (val: string[]) => val?.join(', '),
  },
]);
</script>

<style lang="scss" scoped>
.table-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 10px;
}

.drag-icon {
  cursor: move;
}
</style>
