import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NewMomentService } from './new-moment.service';

@Component({
  selector: 'fampedia-new-moment',
  templateUrl: './new-moment.component.html',
  styleUrls: ['./new-moment.component.scss']
})
export class NewMomentComponent {
  public index = 0;

  constructor(private service: NewMomentService) { }

  public next() {
    this.index++;
  }

  public upload() {
    this.service.uploadMoment();
  }

  public get native() {
    return environment.isNative;
  }

}
