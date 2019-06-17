import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';
import { DirectivesModule } from '../helpers/directives.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    FormsModule,
    DirectivesModule,
  ],
  exports: [NavbarComponent]
})
export class NavbarModule { }
