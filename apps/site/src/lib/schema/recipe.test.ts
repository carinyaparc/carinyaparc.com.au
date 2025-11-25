import { describe, it, expect } from 'vitest';
import { generateRecipeSchema } from '@/lib/schema/recipe';
import { BASE_URL } from '@/lib/constants';

describe('Recipe Schema', () => {
  const baseRecipe = {
    name: 'Test Recipe',
    description: 'A delicious test recipe',
    author: 'Chef Test',
  };

  it('should generate valid Recipe schema with required fields', () => {
    const schema = generateRecipeSchema(baseRecipe);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Recipe');
    expect(schema.name).toBe('Test Recipe');
    expect(schema.description).toBe('A delicious test recipe');
    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'Chef Test',
    });
  });

  it('should handle optional time fields', () => {
    const recipe = {
      ...baseRecipe,
      prepTime: 'PT15M',
      cookTime: 'PT30M',
      totalTime: 'PT45M',
    };

    const schema = generateRecipeSchema(recipe);

    expect(schema.prepTime).toBe('PT15M');
    expect(schema.cookTime).toBe('PT30M');
    expect(schema.totalTime).toBe('PT45M');
  });

  it('should handle recipe yield', () => {
    const recipe = {
      ...baseRecipe,
      recipeYield: '4 servings',
    };

    const schema = generateRecipeSchema(recipe);

    expect(schema.recipeYield).toBe('4 servings');
  });

  it('should handle ingredients array', () => {
    const recipe = {
      ...baseRecipe,
      recipeIngredient: ['1 cup flour', '2 eggs', '1/2 cup milk'],
    };

    const schema = generateRecipeSchema(recipe);

    expect(schema.recipeIngredient).toEqual(['1 cup flour', '2 eggs', '1/2 cup milk']);
  });

  it('should handle recipe instructions', () => {
    const recipe = {
      ...baseRecipe,
      recipeInstructions: 'Mix all ingredients. Bake at 350°F for 30 minutes.',
    };

    const schema = generateRecipeSchema(recipe);

    expect(schema.recipeInstructions).toBe('Mix all ingredients. Bake at 350°F for 30 minutes.');
  });

  it('should handle image URL', () => {
    const recipe = {
      ...baseRecipe,
      image: '/images/recipe.jpg',
    };

    const schema = generateRecipeSchema(recipe);

    expect(schema.image).toBe(`${BASE_URL}/images/recipe.jpg`);
  });

  it('should handle absolute image URLs', () => {
    const recipe = {
      ...baseRecipe,
      image: 'https://example.com/recipe.jpg',
    };

    const schema = generateRecipeSchema(recipe);

    expect(schema.image).toBe('https://example.com/recipe.jpg');
  });

  it('should handle datePublished', () => {
    const recipe = {
      ...baseRecipe,
      datePublished: '2024-01-01',
    };

    const schema = generateRecipeSchema(recipe);

    expect(schema.datePublished).toBe('2024-01-01');
  });

  it('should omit optional fields when not provided', () => {
    const schema = generateRecipeSchema(baseRecipe);

    expect(schema.prepTime).toBeUndefined();
    expect(schema.cookTime).toBeUndefined();
    expect(schema.totalTime).toBeUndefined();
    expect(schema.recipeYield).toBeUndefined();
    expect(schema.recipeIngredient).toBeUndefined();
    expect(schema.recipeInstructions).toBeUndefined();
    expect(schema.image).toBeUndefined();
  });
});
