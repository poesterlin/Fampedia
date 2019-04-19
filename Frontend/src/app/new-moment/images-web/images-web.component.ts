import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fampedia-new-moment-images',
  templateUrl: './images-web.component.html',
  styleUrls: ['./images-web.component.scss']
})
export class ImagesWebComponent implements OnInit {
  public images = new Array(100).fill(null).map(Math.random);
  public takePicture = false;
  constructor() { }

  ngOnInit() {
  }

}
