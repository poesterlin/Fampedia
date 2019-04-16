import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

@Component({
  selector: 'fampedia-moment-image-native',
  templateUrl: './images-native.component.html',
  styleUrls: ['./images-native.component.scss']
})
export class ImagesNativeComponent {
  public image!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
  }

  async takePicture() {
    const { Camera } = Plugins;

    const image = await Camera!.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    // Example of using the Base64 return type. It's recommended to use CameraResultType.Uri
    // instead for performance reasons when showing large, or a large amount of images.
    if (image && image.base64Data) {
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(image.base64Data);
    }
  }

}
