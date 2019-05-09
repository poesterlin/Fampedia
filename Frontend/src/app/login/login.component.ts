import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '../core/core.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public password = "";
  public username = "";

  constructor(private router: Router, private core: CoreService, private loginService: LoginService) { }

  login() {
    // TODO: add loading indicator
    this.core.login(this.username, this.password).subscribe(
      (response: any) => {
         this.loginService.user$.next({ token: response.token, expireDate: new Date(response.expireDate), username: this.username });
         this.router.navigate(['']);
      },
      (error) => console.log(error)
    )
  }

  readonlyUser(){
    this.username = 'fampedia';
    this.password = 'fampedia';
    this.login();
  }


}
