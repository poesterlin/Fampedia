import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeService } from './recipe.service';

const routes: Routes = [
  { path: 'list', component: RecipeListComponent },
  { path: 'new', component: RecipeEditComponent },
  {
    path: ':id',
    component: RecipeDetailComponent,
    children: [{ path: 'edit', component: RecipeEditComponent }]
  },
  { path: '**', redirectTo: '/recipes/list' }
];

@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeEditComponent,
    RecipeDetailComponent,
    RecipeItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [RecipeService]
})
export class RecipesModule {}
