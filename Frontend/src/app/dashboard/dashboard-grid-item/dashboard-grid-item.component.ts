import {
  Component,
  OnInit,
  Input,
  HostBinding,
  HostListener,
  ElementRef
} from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'fampedia-dashboard-grid-item',
  templateUrl: './dashboard-grid-item.component.html',
  styleUrls: ['./dashboard-grid-item.component.scss']
})
export class DashboardGridItemComponent implements OnInit {
  @Input() importance: number = 1;
  @Input() itemId!: number;
  public title = '';
  public desc = '';
  public visible = false;
  private lasturl = '';

  constructor(private sanitizer: DomSanitizer, private elRef: ElementRef) {}

  @HostBinding('style')
  public get gridSize(): SafeStyle {
    let row = 1;
    let column = 1;
    switch (this.importance) {
      case 2:
        row = window.innerWidth < 600 ? 1 : 2;
        break;
      case 3:
        row = 2;
        column = 2;
    }
    return this.sanitizer.bypassSecurityTrustStyle(
      `grid-row-end: span ${row}; grid-column-end: span ${column}`
    );
  }

  ngOnInit() {
    const titles = [
      'Barcelona Vacations',
      'Daily Pictures',
      'Mariage 🎉',
      'Kate’s Birthday',
      'Tacos Tuesdays',
      'Sundays Breakfast'
    ];
    const descriptions = [
      'August 2017',
      'Everyday',
      'Today',
      'Yesterday',
      'Every Tuesday',
      'Next week'
    ];
    const random = Math.floor(Math.random() * titles.length);

    this.title = titles[random];
    this.desc = descriptions[random];
  }

  private isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const height =
      (window.innerHeight || document.documentElement.clientHeight) * 0.5;
    return (
      rect.top >= -height &&
      rect.left >= 0 &&
      rect.bottom <= height &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  @HostListener('window:DOMContentLoaded')
  @HostListener('window:load')
  @HostListener('window:scroll')
  @HostListener('window:resize')
  public onVisibilityChange() {
    if (this.isElementInViewport(this.elRef.nativeElement) && !this.visible) {
      this.visible = true;
    }
  }

  get url() {
    if (!this.lasturl) {
      this.lasturl = 'https://placeimg.com/150/150/any?' + Math.random();
    }
    return this.lasturl;
  }
}
