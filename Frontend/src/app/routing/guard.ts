import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';

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
            this.router.navigate(['/login']);
            return false;
        }
    }
}