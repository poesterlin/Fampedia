import { Component, Input, HostBinding } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'fampedia-grid-item',
  templateUrl: './grid-item.component.html',
  styleUrls: ['./grid-item.component.scss']
})
export class GridItemComponent {
  @Input() importance!: number;
  @Input() imageId!: number;

  constructor(private sanitizer: DomSanitizer, private router: Router) {
  }

  @HostBinding('style')
  public get gridSize(): SafeStyle {
    let row = 1;
    let column = 1;
    switch (this.importance) {
      case 2: row = 2; break;
      case 3: row = 2; column = 2;
    }
    return this.sanitizer.bypassSecurityTrustStyle(
      `grid-row-end: span ${row}; grid-column-end: span ${column}`
    );
  }

  public goToImage() {
    this.router.navigate(['/moment/image/' + this.imageId]);
  }
}
