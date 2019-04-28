import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fampedia-new-moment',
  templateUrl: './new-moment.component.html',
  styleUrls: ['./new-moment.component.scss']
})
export class NewMomentComponent {
  public index = 0;

  constructor() { }


  public next() {
    this.index++;
  }

  public upload() {
    // reload to kill camera stream
    document.location.href = document.location.origin;
  }

  public get native(){
    return environment.isNative;
  }

}
