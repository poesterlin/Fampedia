import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreService } from 'src/app/core/core.service';
import { ErrorService, eMessageDuration } from 'src/app/error/shared/error.service';
import { RegisterService, FamilyMode } from '../register.service';

@Component({
  selector: 'fampedia-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public family = '';
  public password = "";
  public username = "";
  public showScanner = false;
  public mode = FamilyMode.initial;

  constructor(
    public service: RegisterService,
    private core: CoreService,
    private error: ErrorService,
    private router: Router,
    private translate: TranslateService) {
    this.service.familyMode.subscribe(mode => {
      this.mode = mode;
      if (mode === FamilyMode.join) {
        this.checkFamilyName();
      }
    });
  }

  public checkFamilyName() {
    if (!this.service.familyId) { return; }
    this.core.checkFamilyName(this.service.familyId).subscribe(avaliable => {
      this.service.familyMode.next(avaliable ? FamilyMode.joinAvaliable : FamilyMode.joinNotAvaliable);
    });
  }

  public async register() {
    if (this.mode === FamilyMode.createNew && this.family) {
      const response = await this.core.registerFamily(this.family).toPromise();
      this.service.familyId = response.familyId;
    }

    if (!this.service.familyId) { return; }

    this.core.registerUser(this.username, this.password, this.service.familyId).toPromise()
      .then(() => {
        const url = `https://www.fampedia.de/#/register?family=${this.service.familyId}`
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.error.showMessage(this.translate.instant('register.Success'), true, eMessageDuration.Long, this.translate.instant('register.Share'))
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
      }).catch(() => {
        this.service.familyId = undefined;
      });
  }


  public foundID(id: string) {
    this.service.familyId = id;
    this.showScanner = false;
    this.checkFamilyName();
  }
}
