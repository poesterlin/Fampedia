import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';
import { BehaviorSubject } from 'rxjs';
import { Moment } from '../core/Entitys/Moment';

@Injectable()
export class MomentService {
  public readonly moments$: BehaviorSubject<Moment[]> = new BehaviorSubject<Moment[]>([]);

  constructor(private core: CoreService) {
    this.core.getMoments().toPromise().then(() => {
      this.core.moments$.subscribe((moments) => {
        this.moments$.next(moments);
      });
    })
  }

  public getMoment(id: number) {
    return this.moments$.getValue().find(m => m.momentId === id);
  }
}
