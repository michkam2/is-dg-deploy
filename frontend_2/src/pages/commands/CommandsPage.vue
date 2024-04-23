<template>
  <PageLayout :title="t('command.label', 2)">
    <template #actions>
      <SearchBar v-model="filter" />
      <q-btn
        v-if="authStore.isAdmin"
        class="shadow"
        color="primary"
        :icon="mdiPlus"
        :label="t('command.create_command')"
        unelevated
        no-caps
        size="15px"
        @click="createDialogOpen = true"
      />
    </template>
    <template #default>
      <q-table
        :rows="filteredCommands"
        :columns="columns"
        :loading="store.commands.isLoading"
        flat
        :rows-per-page-options="[10, 20, 50]"
        class="shadow"
        :no-data-label="t('table.no_data_label')"
        :loading-label="t('table.loading_label')"
        :rows-per-page-label="t('table.rows_per_page_label')"
      >
        <template #no-data="{ message }">
          <div class="full-width column flex-center q-pa-lg nothing-found-text">
            <q-icon :name="mdiCodeTags" class="q-mb-md" size="50px"></q-icon>
            {{ message }}
          </div>
        </template>

        <template #body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn
              v-if="authStore.isAdmin"
              :icon="mdiPencil"
              color="grey-color"
              flat
              round
              @click.stop="
                editDialogOpen = true;
                commandToEdit = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                {{ t('global.edit') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="authStore.isAdmin"
              :icon="mdiTrashCanOutline"
              color="grey-color"
              flat
              round
              @click.stop="
                deleteDialogOpen = true;
                commandToDelete = props.row;
              "
              ><q-tooltip content-style="font-size: 11px" :offset="[0, 4]">
                {{ t('global.delete') }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </template>
  </PageLayout>
  <create-command-dialog v-model="createDialogOpen" @on-create="store.commands.refresh" />
  <edit-command-dialog
    v-if="commandToEdit"
    v-model="editDialogOpen"
    :command="commandToEdit"
    @on-update="store.commands.refresh"
  />
  <delete-command-dialog
    v-if="commandToDelete"
    v-model="deleteDialogOpen"
    :command="commandToDelete"
    @on-deleted="store.commands.refresh"
  />
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useCommandStore } from '@/stores/command-store';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mdiCodeTags, mdiPencil, mdiTrashCanOutline } from '@quasar/extras/mdi-v6';
import { Command } from '@/models/Command';
import { mdiPlus } from '@quasar/extras/mdi-v6';
import CreateCommandDialog from '@/components/commands/CreateCommandDialog.vue';
import EditCommandDialog from '@/components/commands/EditCommandDialog.vue';
import DeleteCommandDialog from '@/components/commands/DeleteCommandDialog.vue';
import PageLayout from '@/layouts/PageLayout.vue';
import SearchBar from '@/components/core/SearchBar.vue';
import { useAuthStore } from '@/stores/auth-store';

const { t } = useI18n();
const store = useCommandStore();
store.commands.refresh();

const authStore = useAuthStore();

const createDialogOpen = ref(false);

const deleteDialogOpen = ref(false);
const commandToDelete = ref<Command>();

const editDialogOpen = ref(false);
const commandToEdit = ref<Command>();
const filter = ref('');

const filteredCommands = computed(() => {
  if (filter.value === '') {
    return store.commands.data;
  }
  return (
    store.commands.data?.filter((command) => command.name.toLowerCase().includes(filter.value.toLowerCase())) ?? []
  );
});

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'deviceType',
    label: t('device.label'),
    field: 'deviceType',
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
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
  },
]);
</script>
<style lang="scss" scoped></style>
