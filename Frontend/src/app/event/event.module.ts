import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: '**', component: EventComponent, data: { preload: true } }
];

@NgModule({
  declarations: [EventComponent],
  imports: [CommonModule, TranslateModule, RouterModule.forChild(routes)]
})
export class EventModule {}
