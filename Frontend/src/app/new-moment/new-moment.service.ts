import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NewMomentService {
  public readonly showButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public moment: { title?: string, description?: string, date?: Date } = {};
  public images: string[] = [];

  constructor(private core: CoreService) { }

  public uploadMoment() {
    if (this.moment.title && this.moment.description) {
      this.core.addMoment(this.moment.title, this.moment.description, this.moment.date)
        .subscribe(async ({ momentID }) => {
          await this.uploadImages(momentID);

          // reload to kill camera stream
          document.location.href = document.location.origin;
        })
    }
  }

  public async uploadImages(momentID: number) {
    const promises: Promise<any>[] = [];
    for (const image of this.images) {
      promises.push(this.core.addMomentImage('image', momentID, this.dataURItoBlob(image)).toPromise());
    }
    return await Promise.all(promises);
  }

  private dataURItoBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
}
