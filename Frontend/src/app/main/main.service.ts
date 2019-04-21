import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { BehaviorSubject } from 'rxjs';

export enum EComponent {
  Timeline = 'timeline', News = 'news', Archive = 'archive'
}

@Injectable()
export class MainService {
  public readonly comp$: BehaviorSubject<EComponent> = new BehaviorSubject<EComponent>(EComponent.Timeline);

  constructor(private core: CoreService) {
    this.core.getMoments() //.subscribe();
  }
}
