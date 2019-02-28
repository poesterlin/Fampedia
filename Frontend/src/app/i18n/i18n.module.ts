import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        TranslateModule
    ],
    declarations: []
})
export class I18nModule { }
