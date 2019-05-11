import { Injectable, NgZone, ErrorHandler, Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { environment } from '../../../environments/environment';

import { ExceptionComponent } from '../exception/exception.component';

export enum eMessageDuration {
    Short = 1500,
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

    public showMessage(message: string, dismissable = true, messageDuration = eMessageDuration.Middle, action = 'close'): Promise<{ dismissedByAction: boolean }> {
        return new Promise(res => {
            this._ngZone.run(() => {
                const snackBar = this._injector.get<MatSnackBar>(MatSnackBar);
                const snackBarConfig = new MatSnackBarConfig<Error>();
                snackBarConfig.verticalPosition = this.verticalPosition;
                snackBarConfig.horizontalPosition = this.horizontalPosition;
                const duration = dismissable ? messageDuration : undefined;
                const button = dismissable ? action : undefined;
                const snackbarRef = snackBar.open(message, button, { duration });
                snackbarRef.afterDismissed().subscribe(res)
            });
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
