import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fampedia-new-moment',
  templateUrl: './new-moment.component.html',
  styleUrls: ['./new-moment.component.scss']
})
export class NewMomentComponent {
  public index = 0;

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
