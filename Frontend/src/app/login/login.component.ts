import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public password = "";
  public username = "";

  constructor(private router: Router) { }

  login() {
    // TODO: get token
    // TODO: add loading indicator
    console.log(this.username, this.password);
    this.router.navigate(['']);
  }


}
