import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  public recipes: Recipe[] = [];
  public subscription!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['/recipes', 'new']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
