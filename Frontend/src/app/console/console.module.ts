import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '**', data: { title: 'DEV' }, component: ConsoleComponent },
];

@NgModule({
  declarations: [ConsoleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ConsoleModule { }
