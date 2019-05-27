import { Component } from '@angular/core';
import { TimelineElement } from '../timeline-element/timeline-element.component';
import { Moment } from 'src/app/core/Entitys/Moment';
import { MainService } from '../main.service';

@Component({
  selector: 'fampedia-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  public timeline: TimelineElement[][] = [];

  constructor(private service: MainService) {
    this.service.moments$.subscribe(mom => {
      this.timeline = this.convert(mom);
    });
  }

  public convert(moments: Moment[]) {
    const timeline: [TimelineElement[], TimelineElement[]] = [[], []];

    moments
      .filter(m => m.images.length > 0)
      .forEach((moment, idx) => {
        const sideIdx = idx % 2;
        const height = window.innerHeight / 8;
        const margin = 8;
        const last = timeline[sideIdx][timeline[sideIdx].length - 1] || timeline[sideIdx][timeline[sideIdx].length - 1] || { top: - margin };

        let top = last.top + margin;
        const element = {
          row: (sideIdx === 0 ? 'left' : 'right') as any,
          top,
          height: Math.log(Math.max(moment.images.length, 6)) * height,
          moment
        };

        timeline[sideIdx].push(element);
      });
    return timeline;
  }

}
