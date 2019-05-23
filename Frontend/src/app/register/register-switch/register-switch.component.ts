import { Component } from '@angular/core';
import { RegisterService, FamilyMode } from '../register.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-switch',
  templateUrl: './register-switch.component.html',
  styleUrls: ['./register-switch.component.scss']
})
export class RegisterSwitchComponent {
  public mode = FamilyMode.initial;

  constructor(public service: RegisterService, private router: Router, private route: ActivatedRoute) {
    this.service.familyMode.subscribe(mode => {
      this.mode = mode;
    });

    this.route.queryParams.subscribe(params => {
      if (params.family) {
        this.service.familyMode.next(FamilyMode.join);
        this.service.familyId = params.family;
      }
    })
  }

  public modeJoin() {
    this.service.familyMode.next(FamilyMode.join);
  }

  public modeCreateNew() {
    this.service.familyMode.next(FamilyMode.createNew);
  }

  public back() {
    if (this.mode > FamilyMode.initial) {
      this.mode = FamilyMode.initial;
    } else {
      this.router.navigate(['/login']);
    }
  }

}
