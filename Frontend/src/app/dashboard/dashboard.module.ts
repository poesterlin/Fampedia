import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardGridItemComponent } from './dashboard-grid-item/dashboard-grid-item.component';

@NgModule({
  declarations: [DashboardComponent, DashboardGridItemComponent],
  imports: [TranslateModule, CommonModule]
})
export class DashboardModule {}
