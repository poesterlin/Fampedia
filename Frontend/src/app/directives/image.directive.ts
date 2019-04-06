import {
  Directive,
  Input,
  ElementRef,
  HostBinding,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[famImage]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    type: 'img'
  }
})
export class ImageDirective implements AfterViewInit, OnDestroy {
  @Input() image!: string;
  @Output() visibilityChange = new EventEmitter<boolean>();
  @HostBinding('src') private source?: string;

  private observer?: IntersectionObserver;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries =>
      this.onVisibilityChange(entries[0])
    );
    // Start observing an element
    this.observer.observe(this.elRef.nativeElement);
  }

  public onVisibilityChange(elementData: IntersectionObserverEntry) {
    if (elementData.intersectionRatio > 0) {
      if (!this.source) {
        this.source = this.image;
        this.destroy();
      }
      this.visibilityChange.emit(true);
    } else {
      this.visibilityChange.emit(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy() {
    if (this.observer) {
      this.observer.unobserve(this.elRef.nativeElement);
      this.observer.disconnect();
      this.observer = undefined;
    }
  }
}
