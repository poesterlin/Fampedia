import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';

@Injectable()
export class MainService {

  constructor(private core: CoreService) {
    this.core.getMoments().subscribe();
  }
}
