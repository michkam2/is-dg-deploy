<template>
  <PageLayout :title="t('global.create')" :previous-title="t('recipe.label', 2)" previous-route="/recipes">
    <template #actions>
      <q-btn
        unelevated
        color="primary"
        :label="t('global.save')"
        padding="7px 35px"
        no-caps
        type="submit"
        :loading="creatingRecipe"
        @click="createRecipe"
      />
    </template>
    <RecipeForm ref="recipeForm" v-model="recipe" />
  </PageLayout>
</template>

<script setup lang="ts">
import RecipeForm from '@/components/recipes/RecipeForm.vue';
import PageLayout from '@/layouts/PageLayout.vue';
import { RecipeInput, getEmptyRecipeInput } from '@/models/Recipe';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import RecipeService from '@/services/RecipeService';
import { handleError } from '@/utils/error-handler';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const recipe = ref<RecipeInput>(getEmptyRecipeInput());
const creatingRecipe = ref(false);
const recipeForm = ref();

async function createRecipe() {
  if (!recipeForm.value?.validate()) return;

  try {
    creatingRecipe.value = true;
    const createdRecipe = await RecipeService.createRecipe(recipe.value);
    await RecipeService.updateRecipe(createdRecipe, createdRecipe.id); // Must call update to set new commands
    toast.success(t('recipe.toasts.create_success'));
    router.push('/recipes/');
  } catch (error) {
    handleError(error, t('recipe.toasts.create_failed'));
  } finally {
    creatingRecipe.value = false;
  }
}
</script>
