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
import { NewMomentServiceService } from './new-moment-service.service';

const routes: Routes = [{ path: '**', component: NewMomentComponent }];

@NgModule({
  declarations: [NewMomentComponent, DataComponent, ImagesWebComponent, AccessComponent, PeopleSelectComponent, MomentCameraComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NavbarModule,
    MaterialModule,
    DirectivesModule,
    FormsModule
  ],
  providers: [NewMomentServiceService]
})
export class NewMomentModule { }
