import { Recipe, RecipeInput } from 'src/models/Recipe';
import { api } from '@/utils/api';
import DeviceTypeEnum from 'src/models/DeviceType';

class RecipeService {
  async createRecipe(recipe: RecipeInput): Promise<Recipe> {
    return await api<Recipe>('jobs/recipe/createRecipe', {
      method: 'POST',
      body: recipe,
    });
  }

  async getRecipeById(id: string): Promise<Recipe> {
    return await api<Recipe>(`jobs/recipe/getRecipeById/${id}`);
  }

  async getRecipeByName(name: string): Promise<Recipe[]> {
    return await api<Recipe[]>(`jobs/recipe/getRecipeByName/${name}`);
  }

  async getRecipes(sortBy: string, sortDirection: string): Promise<Recipe[]> {
    return await api<Recipe[]>(`jobs/recipe/getAllRecipes/${sortBy}/${sortDirection}`);
  }

  async getNonSubRecipesByDeviceType(deviceType: string, sortBy: string, sortDirection: string): Promise<Recipe[]> {
    return await api<Recipe[]>(`jobs/recipe/getFullRecipesByDeviceType/${deviceType}/${sortBy}/${sortDirection}`);
  }

  async getSubRecipesByDeviceType(deviceType: string, sortBy: string, sortDirection: string): Promise<Recipe[]> {
    return await api<Recipe[]>(`jobs/recipe/getSubRecipesByDeviceType/${deviceType}/${sortBy}/${sortDirection}`);
  }

  async getFullRecipesByDeviceType(deviceType: DeviceTypeEnum): Promise<Recipe[]> {
    return await api<Recipe[]>(`jobs/recipe/getFullRecipesByDeviceType/${deviceType}/NONE/NONE`);
  }

  async deleteRecipeById(id: string): Promise<void> {
    await api(`jobs/recipe/deleteRecipeById/${id}`, {
      method: 'DELETE',
    });
  }

  async removeCommandFromRecipe(recipeId: string, commandId: string, index: number): Promise<void> {
    await api(`jobs/recipe/removeCommandFromRecipe/${recipeId}/${commandId}/${index}`, {
      method: 'DELETE',
    });
  }

  async removeSubRecipeFromRecipe(recipeId: string, subRecipeId: string, index: number): Promise<void> {
    await api(`jobs/recipe/removeSubRecipeFromRecipe/${recipeId}/${subRecipeId}/${index}`, {
      method: 'DELETE',
    });
  }

  async updateRecipe(recipe: RecipeInput, id: string): Promise<Recipe> {
    return await api<Recipe>(`jobs/recipe/updateRecipe/${id}`, {
      method: 'PUT',
      body: recipe,
    });
  }

  async addSubRecipeToRecipe(recipe: RecipeInput, recipeId: string, subRecipeId: string): Promise<Recipe> {
    return await api<Recipe>(`jobs/recipe/addSubRecipeToRecipe/${recipeId}/${subRecipeId}`, {
      method: 'PUT',
      body: recipe,
    });
  }

  async addCommandToRecipe(recipe: RecipeInput, recipeId: string, commandId: string): Promise<Recipe> {
    return await api<Recipe>(`jobs/recipe/addCommandToRecipe/${recipeId}/${commandId}`, {
      method: 'PUT',
      body: recipe,
    });
  }
}

export default new RecipeService();
