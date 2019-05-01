import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private loginService: LoginService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        const user = this.loginService.user$.getValue();
        if (user) {
            req = req.clone({
                setHeaders: {
                  token: user.token,
                  user: user.username
                }
              });
        }
        return next.handle(req)
    }
}