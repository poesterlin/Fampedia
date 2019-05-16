import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentComponent } from './moment.component';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';
import { MomentService } from './moment.service';
import { DirectivesModule } from '../helpers/directives.module';
import { GridItemComponent } from './grid-item/grid-item.component';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';
import { CommentsComponent } from './comment/comment.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: ':id', component: MomentComponent, data: { preload: true } },
  { path: 'image/:id', component: PhotoDetailsComponent, data: { preload: true } },
  // children: [{ path: 'edit', component:  }]
  // { path: 'new', component:  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [MomentComponent, GridItemComponent, PhotoDetailsComponent, CommentsComponent],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    MaterialModule,
    FormsModule
  ],
  providers: [MomentService]
})
export class MomentModule { }
