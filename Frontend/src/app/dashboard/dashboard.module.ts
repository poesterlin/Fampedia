import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardGridItemComponent } from './dashboard-grid-item/dashboard-grid-item.component';
import { RouterModule, Routes } from '@angular/router';
import { DirectivesModule } from '../directives/directives.module';

const routes: Routes = [{ path: '**', component: DashboardComponent, data: { preload: true } }];

@NgModule({
  declarations: [DashboardComponent, DashboardGridItemComponent],
  imports: [TranslateModule, CommonModule, RouterModule.forChild(routes), DirectivesModule],
})
export class DashboardModule {}
