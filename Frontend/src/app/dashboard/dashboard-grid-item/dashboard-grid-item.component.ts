import {
  Component,
  OnInit,
  Input,
  HostBinding,
  HostListener,
  ElementRef
} from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fampedia-dashboard-grid-item',
  templateUrl: './dashboard-grid-item.component.html',
  styleUrls: ['./dashboard-grid-item.component.scss']
})
export class DashboardGridItemComponent implements OnInit {
  @Input() importance: number = 1;
  @Input() itemId!: string;
  public visible = false;
  private lasturl = '';

  constructor(
    private sanitizer: DomSanitizer,
    private elRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
    this.route.params.subscribe(() => {
      this.onVisibilityChange();
    });
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

  public goToEvent() {
    this.router.navigate(['/event/', this.itemId]);
  }

  get url() {
    if (!this.lasturl) {
      this.lasturl = 'https://picsum.photos/200/300/?random&' + Math.random();
    }
    return this.lasturl;
  }
}
