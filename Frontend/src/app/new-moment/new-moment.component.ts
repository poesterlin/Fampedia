import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'fampedia-new-moment',
  templateUrl: './new-moment.component.html',
  styleUrls: ['./new-moment.component.scss']
})
export class NewMomentComponent {
  public index = 0;

  constructor(private core: CoreService) { }


  public next() {
    this.index++;
  }

  public upload() {
    // reload to kill camera stream
    document.location.href = document.location.origin;
    const title = 'This is a dummy title'
    const description = 'This is a dummy description'
    const familyID = 'testfamily'
    this.core.addMoment(title, description, familyID)
        .subscribe(
          (response) => {
            console.log(response)
          },
          (error) => console.log(error)
        )
  }

  public get native(){
    return environment.isNative;
  }

}
