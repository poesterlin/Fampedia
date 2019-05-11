import { Component, OnInit } from '@angular/core';
import { CoreService } from '../core/core.service';
import { ErrorService, eMessageDuration } from '../error/shared/error.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private service: CoreService, private error: ErrorService, private router: Router, private route: ActivatedRoute, ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.family) {
        this.family = decodeURIComponent(params.family);
      }
    })
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
        const url = `https://www.fampedia.de/#/register?family=${this.family}`
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        debugger
        this.error.showMessage('Registration successfull. Invite link was copied to clipboard.', true, eMessageDuration.Long, 'share')
          .then(resp => {
            if (resp.dismissedByAction && (<any>navigator).share) {
              (<any>navigator).share({
                title: 'Fampedia Register',
                text: 'Join my Family',
                url,
              });
            }
          });
        setTimeout(() => this.router.navigate(['/login']), 100);
      });
  }

}
