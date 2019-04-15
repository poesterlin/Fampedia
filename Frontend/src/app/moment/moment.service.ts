import { Injectable } from '@angular/core';
import { CoreService } from '../core/core.service';

@Injectable()
export class MomentService {

  constructor(private core: CoreService) {
    this.core.getMoments().subscribe();
  }


}
