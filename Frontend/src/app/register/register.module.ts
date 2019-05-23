import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';


const routes: Routes = [
  { path: '**', data: { title: 'NOT_FOUND' }, component: RegisterComponent },
];

@NgModule({
  declarations: [RegisterComponent, QrScannerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(routes),
    TranslateModule
  ]
})
export class RegisterModule { }
