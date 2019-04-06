import { Directive, Input, ElementRef, HostListener, HostBinding, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Directive({
  selector: '[famImage]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    'type': 'img'
  }
})
export class ImageDirective implements OnInit {
  @Input() image!: string;
  @Output() visibilityChange = new EventEmitter<boolean>();
  @HostBinding('src') private source?: string;

  constructor(private route: ActivatedRoute, private elRef: ElementRef) { }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.onVisibilityChange();
    });
  }

  private isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const height = window.innerHeight * 0.5;
    return (
      rect.top >= -height &&
      rect.left >= 0 &&
      rect.bottom <= height * 2.5 &&
      rect.right <= window.innerWidth * 1.4
    );
  }

  @HostListener('window:DOMContentLoaded')
  @HostListener('window:load')
  @HostListener('window:scroll')
  @HostListener('window:mousewheel')
  // @HostListener('mousewheel')
  @HostListener('window:resize')
  public onVisibilityChange() {
    if (this.isElementInViewport(this.elRef.nativeElement)) {
      if (!this.source) {
        this.source = this.image;
      }
      this.visibilityChange.emit(true);
    } else {
      this.visibilityChange.emit(false);
    }
  }

}
