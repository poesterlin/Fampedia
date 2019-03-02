import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '../not-found/not-found.component';
import { DashboardComponent } from '../dashboard/dashboard.component';


const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, data: { title: 'DASHBOARD' } },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    // wildcard for invalid urls
    { path: '**', component: NotFoundComponent, data: { title: 'NOT_FOUND' } },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { enableTracing: false, useHash: true })],
    exports: [RouterModule]
})
export class RoutingModule { }
