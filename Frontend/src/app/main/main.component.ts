import { Component } from '@angular/core';
import { EComponent, MainService } from './main.service';

@Component({
  selector: 'fampedia-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public comp!: EComponent;


  constructor(private service: MainService) {
    this.service.comp$.subscribe(comp => this.comp = comp);
  }

  public setComp(comp: number) {
    switch (comp) {
      case EComponent.Archive: this.service.comp$.next(EComponent.Archive); break;
      case EComponent.Timeline: this.service.comp$.next(EComponent.Timeline); break;
      case EComponent.News: this.service.comp$.next(EComponent.News); break;
    }
  }

  public left() {
    if (this.comp < 2) {
      this.setComp(this.comp + 1);
    }
  }

  public right() {
    if (this.comp > 0) {
      this.setComp(this.comp - 1);
    }
  }
}
