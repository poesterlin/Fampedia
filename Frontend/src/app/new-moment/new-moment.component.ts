import { Component } from '@angular/core';
import { HeaderMode } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fampedia-new-moment',
  templateUrl: './new-moment.component.html',
  styleUrls: ['./new-moment.component.scss']
})
export class NewMomentComponent {
  public index = 0;
  public navConf: HeaderMode = {
    color: 'white',
    buttons: [{
      key: 'NONE',
      icon: 'keyboard_backspace',
      onClick: { internalRoute: '/main' }
    }],
    helpers: [],
    headline: 'NEW MOMENT'
  }

  constructor(private router: Router) { }


  public next() {
    this.index++;
  }

  public upload() {
    this.router.navigate(['/main']);
  }

  public get native(){
    return environment.isNative;
  }

}
