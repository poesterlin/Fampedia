import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from './ingredient.model';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Burger',
      'A super-tasty burger - just awesome!',
      'http://www.f-covers.com/cover/strawberries-13-facebook-cover-timeline-banner-for-fb.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]),
    new Recipe('Awesome dessert',
      'What else you need to say?',
      'http://www.f-covers.com/cover/dessert-5-facebook-cover-timeline-banner-for-fb.jpg',
      [
        new Ingredient('Something', 2),
        new Ingredient('Another ingredient', 1)
      ])
  ];

  constructor() {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
