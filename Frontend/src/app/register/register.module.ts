import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { RegisterSwitchComponent } from './register-switch/register-switch.component';
import { RegisterComponent } from './register/register.component';
import { RegisterService } from './register.service';


const routes: Routes = [
  { path: '**', data: { title: 'NOT_FOUND' }, component: RegisterSwitchComponent },
];

@NgModule({
  declarations: [RegisterComponent, QrScannerComponent, RegisterSwitchComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  providers: [
    RegisterService
  ]
})
export class RegisterModule { }
