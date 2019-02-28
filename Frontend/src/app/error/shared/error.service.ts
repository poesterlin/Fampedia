import { Injectable, NgZone, ErrorHandler, Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { environment } from '../../../environments/environment';

import { ExceptionComponent } from '../exception/exception.component';

export enum eMessageDuration {
    Short = 1700,
    Middle = 3000,
    Long = 7000
}

@Injectable({
    providedIn: 'root'
})
export class ErrorService implements ErrorHandler {
    private _ngZone: NgZone;
    private _injector: Injector;
    public horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    public verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(ngZone: NgZone, injector: Injector) {
        this._ngZone = ngZone;
        this._injector = injector;
    }

    public handleError(error: Error) {
        if (!environment.production) {
            this.showException(error);
            throw error;
        }
    }

    public showMessage(message: string, dismissable = true, messageDuration = eMessageDuration.Middle) {
        this._ngZone.run(() => {
            const snackBar = this._injector.get<MatSnackBar>(MatSnackBar);
            const snackBarConfig = new MatSnackBarConfig<Error>();
            snackBarConfig.verticalPosition = this.verticalPosition;
            snackBarConfig.horizontalPosition = this.horizontalPosition;
            const duration = dismissable ? messageDuration : undefined;
            const action = dismissable ? 'close' : undefined;
            snackBar.open(message, action , { duration });
        });
    }

    public showException(error: Error) {
        this._ngZone.run(() => {
            const snackBar = this._injector.get<MatSnackBar>(MatSnackBar);
            const snackBarConfig = new MatSnackBarConfig<Error>();
            snackBarConfig.verticalPosition = this.verticalPosition;
            snackBarConfig.horizontalPosition = this.horizontalPosition;
            snackBarConfig.panelClass = ['custom-snack-bar-container', 'mat-snack-bar-container'];
            snackBarConfig.data = error;
            snackBar.openFromComponent(ExceptionComponent, snackBarConfig);
        });
    }
}
