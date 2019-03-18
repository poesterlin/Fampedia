import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';

const routes: Routes = [
  { path: '**', component: EventComponent, data: { preload: true } }
];

@NgModule({
  declarations: [EventComponent],
  imports: [CommonModule, MaterialModule, TranslateModule, RouterModule.forChild(routes)]
})
export class EventModule {}
