import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloader } from './CustomPreloader';
// import { RecipesComponent } from '../recipes/recipes.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: '../dashboard/dashboard.module#DashboardModule',
    data: { title: 'DASHBOARD', preload: true }
  },
  {
    path: 'main',
    loadChildren: '../main/main.module#MainModule',
    data: { title: 'DASHBOARD', preload: true }
  },
  {
    path: 'event/:id',
    loadChildren: '../event/event.module#EventModule',
    data: { title: 'EVENT', preload: true, delay: 5 }
  },
  {
    path: 'recipes',
    loadChildren: '../recipes/recipes.module#RecipesModule',
    data: { title: 'RECIPES', preload: true, delay: 5 }
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
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
