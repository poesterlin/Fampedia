import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesComponent } from './recipes.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '**', component: RecipesComponent, data: { preload: true } }];

@NgModule({
  declarations: [RecipesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class RecipesModule { }
