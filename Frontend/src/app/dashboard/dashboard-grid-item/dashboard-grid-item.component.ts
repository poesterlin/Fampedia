import { Component, OnInit, Input, HostBinding, HostListener, ElementRef } from '@angular/core';
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

  constructor(private sanitizer: DomSanitizer, private elRef: ElementRef) { }

  @HostBinding('style')
  public get flex(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`flex: ${this.importance} ${this.importance} ${this.importance * 20}%`);
  }

  ngOnInit() {
    const titles = ['Barcelona Vacations', 'Daily Pictures', 'Mariage 🎉', 'Kate’s Birthday', 'Tacos Tuesdays', 'Sundays Breakfast'];
    const descriptions = ['August 2017', 'Everyday', 'Today', 'Yesterday', 'Every Tuesday', 'Next week'];
    const random = Math.floor(Math.random() * titles.length);

    this.title = titles[random];
    this.desc = descriptions[random];
  }

  private isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const height = (window.innerHeight || document.documentElement.clientHeight) * 0.5;
    return (
      rect.top >= -height &&
      rect.left >= 0 &&
      rect.bottom <= height * 4 &&
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
      this.lasturl = 'https://placeimg.com/150/150/any?' + Math.random()
    }
    return this.lasturl;
  }
}
