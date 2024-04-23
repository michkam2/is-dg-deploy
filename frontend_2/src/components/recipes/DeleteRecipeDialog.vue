<template>
  <DeleteConfirmationDialog v-model="isDialogOpen" :loading="isDeleteInProgress" @on-submit="handleDelete">
    <template #title>{{ t('recipe.delete_recipe') }}</template>
    <template #description>{{ t('recipe.delete_recipe_desc') }}</template>
  </DeleteConfirmationDialog>
</template>

<script setup lang="ts">
import { handleError } from '@/utils/error-handler';
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';
import DeleteConfirmationDialog from '@/components/core/DeleteConfirmationDialog.vue';
import { Recipe } from '@/models/Recipe';
import RecipeService from '@/services/RecipeService';

const isDialogOpen = defineModel<boolean>();
const props = defineProps({
  recipe: {
    type: Object as PropType<Recipe>,
    required: true,
  },
});
const emit = defineEmits(['onDeleted']);

const { t } = useI18n();

const isDeleteInProgress = ref(false);
async function handleDelete() {
  try {
    isDeleteInProgress.value = true;
    await RecipeService.deleteRecipeById(props.recipe.id);
    isDialogOpen.value = false;
    emit('onDeleted');
    toast.success(t('recipe.toasts.delete_success'));
  } catch (error) {
    handleError(error, t('recipe.toasts.delete_failed'));
  } finally {
    isDeleteInProgress.value = false;
  }
}
</script>
