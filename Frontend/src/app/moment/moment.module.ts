import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentComponent } from './moment.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';
import { MomentService } from './moment.service';

const routes: Routes = [
  { path: ':id', component: MomentComponent, data: { preload: true }},
  // children: [{ path: 'edit', component:  }]
  // { path: 'new', component:  },
  { path: '**', redirectTo: '/main' }
];

@NgModule({
  declarations: [MomentComponent],
  imports: [CommonModule, MaterialModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [MomentService]
})
export class MomentModule {}
