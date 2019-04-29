import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDirective } from './image.directive';
import { ProfilePicComponent } from './profile-pic/profile-pic.component';

@NgModule({
  declarations: [
    ImageDirective,
    ProfilePicComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageDirective,
    ProfilePicComponent
  ]
})
export class DirectivesModule { }
