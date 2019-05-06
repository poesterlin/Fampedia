import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewMomentComponent } from './new-moment.component';
import { RouterModule, Routes } from '@angular/router';
import { NavbarModule } from '../navbar/navbar.module';
import { MaterialModule } from '../material/material.module';
import { DataComponent } from './data/data.component';
import { ImagesWebComponent } from './images-web/images-web.component';
import { AccessComponent } from './access/access.component';
import { PeopleSelectComponent } from './people-select/people-select.component';
import { MomentCameraComponent } from './moment-camera/moment-camera.component';
import { DirectivesModule } from '../helpers/directives.module';
import { FormsModule } from '@angular/forms';
import { NewMomentService } from './new-moment.service';
import { AddImageComponent } from './add-image/add-image.component';

const routes: Routes = [
  { path: 'moment', data: { title: 'NOT_FOUND' }, component: NewMomentComponent },
  {
    path: 'add', data: { title: 'NOT_FOUND' },
    children: [{ path: ':id', component: AddImageComponent }]
  }
];

@NgModule({
  declarations: [
    NewMomentComponent,
    DataComponent,
    ImagesWebComponent,
    AccessComponent,
    PeopleSelectComponent,
    MomentCameraComponent,
    AddImageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NavbarModule,
    MaterialModule,
    DirectivesModule,
    FormsModule
  ],
  providers: [NewMomentService]
})
export class NewMomentModule { }
