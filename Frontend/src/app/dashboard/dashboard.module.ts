import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardGridItemComponent } from './dashboard-grid-item/dashboard-grid-item.component';
import { RouterModule, Routes } from '@angular/router';
import { DirectivesModule } from '../directives/directives.module';
import { SideScrollComponent } from './side-scroll/side-scroll.component';

import { MaterialModule } from '../material/material.module';

const routes: Routes = [
  { path: '**', component: DashboardComponent, data: { preload: true } }
];

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardGridItemComponent,
    SideScrollComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    MaterialModule
  ]
})
export class DashboardModule {}
