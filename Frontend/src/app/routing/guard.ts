import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { LoginService } from '../login/login.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class IsLoggedIn implements CanActivate {
    public path: ActivatedRouteSnapshot[] = [];
    public route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot;

    constructor(private loginService: LoginService, private router: Router) { }

    canActivate() {
        if (this.loginService.isLoggedIn()) {
            return true;
        } else {
            // TODO: activate guard
            this.router; // .navigate(['/login']);
            console.log("not logged in");
            return true;
        }
    }
}