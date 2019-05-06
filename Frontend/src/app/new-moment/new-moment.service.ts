import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';

@Injectable()
export class NewMomentService {
  public moment: { title?: string, description?: string, date?: Date } = {};
  public images: string[] = [];

  constructor(private core: CoreService) { }

  public uploadMoment() {
    if (this.moment.title && this.moment.description) {
      this.core.addMoment(this.moment.title, this.moment.description, this.moment.date)
        .subscribe(async ({ momentID }) => {
          const promises: Promise<any>[] = [];
          for (const image of this.images) {
            promises.push(this.core.addMomentImage('image', momentID, this.dataURItoBlob(image)).toPromise());
          }
          await Promise.all(promises);
          
          // reload to kill camera stream
          document.location.href = document.location.origin;
        })
    }
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
