import { defineStore } from 'pinia';
import { reactive } from 'vue';
import recipeService from '@/services/RecipeService';
import { useI18n } from 'vue-i18n';
import { useAsyncData } from '@/composables/useAsyncData';
import { Recipe } from '@/models/Recipe';

export const useRecipeStore = defineStore('recipe', () => {
  const { t } = useI18n();

  const recipes = reactive(
    useAsyncData(() => recipeService.getRecipes('none', 'none'), t('recipe.toasts.load_failed'), false),
  );

  function getRecipeById(id: string): Recipe | undefined {
    return recipes.data?.find((recipe) => recipe.id === id);
  }

  return {
    recipes,
    getRecipeById,
  };
});
