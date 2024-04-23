<template>
  <PageLayout :title="t('recipe.label', 2)">
    <template #actions>
      <SearchBar v-model="filter" />
      <q-btn
        v-if="authStore.isAdmin"
        class="shadow"
        color="primary"
        :icon="mdiPlus"
        :label="t('recipe.create_recipe')"
        to="/recipes/create"
        unelevated
        no-caps
        size="15px"
      />
    </template>
    <template #default>
      <q-table
        :rows="filteredRecipes"
        :columns="columns"
        :loading="store.recipes.isLoading"
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

        <template #body-cell-name="props">
          <q-td :props="props">
            <RouterLink class="text-black" :to="`/recipes/${props.row.id}/edit`">{{ props.row.name }}</RouterLink>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td auto-width :props="props">
            <q-btn
              v-if="authStore.isAdmin"
              :to="`/recipes/${props.row.id}/edit`"
              :icon="mdiPencil"
              color="grey-color"
              flat
              round
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
                recipeToDelete = props.row;
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
  <DeleteRecipeDialog
    v-if="recipeToDelete"
    v-model="deleteDialogOpen"
    :recipe="recipeToDelete"
    @on-delete="store.recipes.refresh"
  />
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mdiCodeTags, mdiPencil, mdiTrashCanOutline } from '@quasar/extras/mdi-v6';
import { mdiPlus } from '@quasar/extras/mdi-v6';
import { useRecipeStore } from '@/stores/recipe-store';
import { Recipe } from '@/models/Recipe';
import DeleteRecipeDialog from '@/components/recipes/DeleteRecipeDialog.vue';
import PageLayout from '@/layouts/PageLayout.vue';
import SearchBar from '@/components/core/SearchBar.vue';
import { useAuthStore } from '@/stores/auth-store';

const { t } = useI18n();
const store = useRecipeStore();
store.recipes.refresh();

const authStore = useAuthStore();

const deleteDialogOpen = ref(false);
const recipeToDelete = ref<Recipe>();
const filter = ref('');

const filteredRecipes = computed(() => {
  if (filter.value === '') {
    return store.recipes.data;
  }
  return store.recipes.data?.filter((recipe) => recipe.name.toLowerCase().includes(filter.value.toLowerCase())) ?? [];
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
    label: t('device.device_type'),
    field: 'deviceType',
    sortable: true,
    align: 'left',
  },
  {
    name: 'subrecipe',
    label: t('recipe.subrecipe'),
    field: 'subRecipe',
    format: (value) => (value ? t('global.yes') : t('global.no')),
    sortable: true,
    align: 'left',
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
