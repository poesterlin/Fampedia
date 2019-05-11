import { Directive, Input, ElementRef, HostBinding, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';

const transparentGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

@Directive({
  selector: '[famImage]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    type: 'img'
  }
})
export class ImageDirective implements AfterViewInit, OnDestroy {
  @Input() imageId!: string;
  @Input() size: 50 | 320 | 640 = 320;
  @Input() lazy: boolean = false;

  @HostBinding('src') private source = transparentGif;

  private observer?: IntersectionObserver;
  private visible = false;
  private parent?: HTMLElement | null;
  private loadingClass = 'loadingImage';

  constructor(private elRef: ElementRef) { }

  ngAfterViewInit(): void {
    if (!this.lazy) {
      this.onVisibilityChange();
      return;
    }
    this.parent = (this.elRef.nativeElement as HTMLImageElement).parentElement;
    this.addLoadingClass();
    this.observer = new IntersectionObserver(entries =>
      this.onVisibilityChange(entries[0])
    );
    // Start observing an element
    this.observer.observe(this.elRef.nativeElement);
  }

  public onVisibilityChange(elementData?: IntersectionObserverEntry) {
    if (!elementData || elementData.intersectionRatio > 0 && this.source) {
      setTimeout(() => {
        this.source = `${environment.url}/momentimage/getImage/${this.size}/${this.imageId}`;
      })
      this.visible = true;
      this.destroy();
    }
  }

  addLoadingClass() {
    if (this.parent && !this.parent.classList.contains(this.loadingClass)) {
      this.parent.classList.add(this.loadingClass);
    }
  }

  rmLoadingClass() {
    if (this.parent && this.parent.classList.contains(this.loadingClass)) {
      this.parent.classList.remove(this.loadingClass);
    }
  }

  @HostListener('load')
  loaded() {
    if (this.visible) {
      this.rmLoadingClass();
    }
  }

  @HostListener('error')
  failed() {
    if (this.visible) {
      this.source = transparentGif;
      this.rmLoadingClass();
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
