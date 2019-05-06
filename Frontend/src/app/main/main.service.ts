import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { BehaviorSubject } from 'rxjs';
import { Moment } from '../core/Entitys/Moment';

export enum EComponent {
  Timeline = 0, News = 1, Archive = 2
}

@Injectable()
export class MainService {
  public readonly comp$: BehaviorSubject<EComponent> = new BehaviorSubject<EComponent>(EComponent.Timeline);
  public readonly moments$: BehaviorSubject<Moment[]> = new BehaviorSubject<Moment[]>([]);


  constructor(private core: CoreService) {
    this.core.getMoments().subscribe(moments=>{
      this.moments$.next(moments);
    });
  }
}
