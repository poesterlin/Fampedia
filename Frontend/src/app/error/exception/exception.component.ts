import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';


@Component({
    selector: 'fampedia-error-exception',
    templateUrl: './exception.component.html',
    styleUrls: ['./exception.component.scss']
})
export class ExceptionComponent {
    private _snackBarRef: MatSnackBarRef<any>;

    constructor(snackBarRef: MatSnackBarRef<any>,
        @Inject(MAT_SNACK_BAR_DATA) public data: Error,
    ) {
        this._snackBarRef = snackBarRef;
    }

    public dismiss() {
        this._snackBarRef.dismiss();
    }
}
