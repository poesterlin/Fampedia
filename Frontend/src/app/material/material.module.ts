import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatDialogModule,
    MatBadgeModule,
    MatIconRegistry,
    MatSliderModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTabsModule,
    MatChipsModule,
    MatTreeModule,
    MatAutocompleteModule,
} from '@angular/material';

const modules = [
    // Flex Layout
    FlexLayoutModule,
    // Angular Material animation
    BrowserAnimationsModule,
    // Angular Material Modules
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSliderModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTabsModule,
    MatChipsModule,
    MatTreeModule,
    MatAutocompleteModule,
];

@NgModule({
    imports: modules,
    exports: modules
})
export class MaterialModule {
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
        matIconRegistry.registerFontClassAlias('mdi');
    }
}
