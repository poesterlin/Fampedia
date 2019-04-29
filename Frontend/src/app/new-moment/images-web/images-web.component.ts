import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fampedia-new-moment-images',
  templateUrl: './images-web.component.html',
  styleUrls: ['./images-web.component.scss']
})
export class ImagesWebComponent implements OnInit {
  public images = new Array(100).fill(null).map(() => ({ i: Math.random(), data: "" }));
  public takePicture = false;
  private selected: number[] = [];
  constructor() { }

  ngOnInit() {
  }

  public addImages(images: string[]) {
    this.images.unshift(...images.map(data => ({ i: 0, data })));
    this.takePicture = false;
  }

  public select(idx: number) {
    if (this.selected.includes(idx)) {
      this.selected.splice(this.selected.findIndex(n => n === idx), 1);
    } else {
      this.selected.push(idx);
    }
  }

  public isSelected(idx: number) {
    return this.selected.includes(idx);
  }

}
