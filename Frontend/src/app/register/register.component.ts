import { Component, OnInit } from '@angular/core';
import { CoreService } from '../core/core.service';
import { ErrorService } from '../error/shared/error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'fampedia-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public family = '';
  public password = "";
  public username = "";
  public avaliable = true;

  constructor(private service: CoreService, private error: ErrorService, private router: Router) { }

  ngOnInit() {
  }

  public checkFamilyName() {
    this.service.checkFamilyName(this.family).subscribe(avaliable => this.avaliable = avaliable);
  }

  public async register() {
    if (!this.avaliable) {
      await this.service.registerFamily(this.family).toPromise();
    }

    this.service.registerUser(this.username, this.password, this.family)
      .subscribe(() => {
        this.error.showMessage('registration successfull. You can login now.');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      });
  }

}
