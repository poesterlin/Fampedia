import { Component, OnInit } from '@angular/core';
import { NewMomentService } from './new-moment.service';
import { ErrorService, eMessageDuration } from '../error/shared/error.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fampedia-new-moment',
  templateUrl: './new-moment.component.html',
  styleUrls: ['./new-moment.component.scss']
})
export class NewMomentComponent implements OnInit {
  public index = 0;
  public showButton = true;

  constructor(private service: NewMomentService, private error: ErrorService, private translate: TranslateService, private router: Router) { }

  ngOnInit() {
    this.service.showButton.subscribe(val => this.showButton = val);
  }

  public next() {
    if (this.index === 1) {
      if (this.service.images.length > 0) {
        this.index++;
      } else {
        this.error.showMessage(this.translate.instant('AddingMoment.Image_Missing'), true, eMessageDuration.Short);
      }
    }

    if (this.index === 0) {
      if (this.service.moment.title && this.service.moment.description) {
        this.index++;
      } else {
        this.error.showMessage(this.translate.instant('AddingMoment.Data_Missing'), true, eMessageDuration.Short);
      }
    }
  }

  public async upload() {
    const id = await this.service.uploadMoment();
    this.router.navigate(['/moment/' + id]);
  }

}
