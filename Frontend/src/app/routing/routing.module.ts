import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloader } from './CustomPreloader';
import { LoginComponent } from '../login/login.component';
import { IsLoggedIn } from './guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: '../main/main.module#MainModule',
    data: { title: 'MAIN', preload: true },
    pathMatch: 'full',
    canActivate: [IsLoggedIn],
  },
  { path: 'main', redirectTo: '' },
  { path: 'login', data: { title: 'LOGIN' }, component: LoginComponent },
  {
    path: 'moment',
    loadChildren: '../moment/moment.module#MomentModule',
    data: { title: 'MOMENT', preload: true, delay: 5 },
    canActivate: [IsLoggedIn],
  },
  {
    path: 'register',
    loadChildren: '../register/register.module#RegisterModule',
    data: { title: 'MOMENT', preload: false },
  },
  // {
  //   path: 'recipes',
  //   loadChildren: '../recipes/recipes.module#RecipesModule',
  //   data: { title: 'RECIPES', preload: true, delay: 5 },
  //   canActivate: [IsLoggedIn],
  // },
  {
    path: 'new',
    loadChildren: '../new-moment/new-moment.module#NewMomentModule',
    data: { preload: false, delay: 5, title: 'NEW_MOMENT' },
    canActivate: [IsLoggedIn],
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
  providers: [CustomPreloader],
})
export class RoutingModule { }
