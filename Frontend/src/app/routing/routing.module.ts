import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloader } from './CustomPreloader';

const routes: Routes = [
  {
    path: '',
    loadChildren: '../main/main.module#MainModule',
    data: { title: 'MAIN', preload: true },
    pathMatch: 'full'
  },
  {
    path: 'moment',
    loadChildren: '../moment/moment.module#MomentModule',
    data: { title: 'MOMENT', preload: true, delay: 5 }
  },
  {
    path: 'recipes',
    loadChildren: '../recipes/recipes.module#RecipesModule',
    data: { title: 'RECIPES', preload: true, delay: 5 }
  },
  {
    path: 'new',
    loadChildren: '../new-moment/new-moment.module#NewMomentModule',
    data: { preload: false, delay: 5 }
  },
  // wildcard for invalid urls
  {
    path: '**',
    loadChildren: '../not-found/not-found.module#NotFoundModule',
    data: { title: 'NOT_FOUND', preload: false }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: CustomPreloader
    })
  ],
  exports: [RouterModule],
  providers: [CustomPreloader]
})
export class RoutingModule { }
