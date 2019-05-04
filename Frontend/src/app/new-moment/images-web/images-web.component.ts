import { Component, OnInit } from '@angular/core';
import { NewMomentService } from '../new-moment.service';

@Component({
  selector: 'fampedia-new-moment-images',
  templateUrl: './images-web.component.html',
  styleUrls: ['./images-web.component.scss']
})
export class ImagesWebComponent implements OnInit {
  public images: { i: number, data?: string }[] = new Array(100).fill(null).map(() => ({ i: Math.random(), data: undefined }));
  public takePicture = false;
  private selected: number[] = [];

  constructor(private service: NewMomentService) { }

  ngOnInit() { }

  public addImages(images: string[]) {
    this.images.unshift(...images.map(data => ({ i: 0, data })));
    this.selected = this.selected.map(n => n + images.length);
    this.takePicture = false;
  }

  public select(idx: number) {
    if (this.selected.includes(idx)) {
      this.selected.splice(this.selected.findIndex(n => n === idx), 1);
    } else {
      this.selected.push(idx);
    }
    this.service.images = this.images.filter((img, idx) => this.selected.includes(idx) && img.data).map(img => img.data) as string[];
  }

  public isSelected(idx: number) {
    return this.selected.includes(idx);
  }


}
