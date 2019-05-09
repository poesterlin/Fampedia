import { Component } from '@angular/core';
import { NewMomentService } from './new-moment.service';
import { ErrorService, eMessageDuration } from '../error/shared/error.service';

@Component({
  selector: 'fampedia-new-moment',
  templateUrl: './new-moment.component.html',
  styleUrls: ['./new-moment.component.scss']
})
export class NewMomentComponent {
  public index = 0;

  constructor(private service: NewMomentService, private error: ErrorService) { }

  public next() {
    if (this.index === 1) {
      if (this.service.images.length > 0) {
      this.index++;
      } else {
        this.error.showMessage('Please add at least one image.', true, eMessageDuration.Short);
      }
    }

    if (this.index === 0) {
      if (this.service.moment.title && this.service.moment.description) {
        this.index++;
      } else {
        this.error.showMessage('Please fill out everything.', true, eMessageDuration.Short);
      }
    }
  }

  public upload() {
    this.service.uploadMoment();
  }

}
