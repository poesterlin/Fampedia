import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { IsLoggedIn } from './guard';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService, private guard: IsLoggedIn) { }
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
    return next.handle(req).pipe(catchError((err, _) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.loginService.user$.next(undefined);
          this.guard.canActivate();
        }
      }
      return throwError('user unauthorised');
    }));
  }
}