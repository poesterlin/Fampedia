import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fampedia-new-moment-images',
  templateUrl: './images-web.component.html',
  styleUrls: ['./images-web.component.scss']
})
export class ImagesWebComponent implements OnInit {
  public images = new Array(100).fill(null).map(() => ({ i: Math.random(), data: "" }));
  public takePicture = false;
  constructor() { }

  ngOnInit() {
  }

  public addImages(images: string[]) {
    this.images.unshift(...images.map(data => ({ i: 0, data })));
    this.takePicture = false;
  }

}
