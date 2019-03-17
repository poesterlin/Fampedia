import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloader } from './CustomPreloader';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: '../dashboard/dashboard.module#DashboardModule',
    data: { title: 'DASHBOARD', preload: true }
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
      enableTracing: false,
      useHash: true,
      preloadingStrategy: CustomPreloader
    })
  ],
  exports: [RouterModule],
  providers: [CustomPreloader]
})
export class RoutingModule {}
