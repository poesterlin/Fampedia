import { Component, OnInit } from '@angular/core';
import { TimelineElement } from './timeline-element/timeline-element.component';

interface Event {
  title: string;
  desc: string;
  img: string;
  date: Date;
}

@Component({
  selector: 'fampedia-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private events: Event[] = [];

  public timeline: TimelineElement[][] = [];

  constructor() {
    this.init(50);
    this.timeline = this.convert();
  }

  public convert() {
    const timeline: [TimelineElement[], TimelineElement[]] = [[], []];

    const dateSort = (d1: Event, d2: Event) =>
      d1.date.getTime() - d2.date.getTime();

    this.events.sort(dateSort).forEach((event, idx) => {
      const sideIdx = idx % 2;
      const height = window.innerHeight / 5;
      const margin = 8;
      const last = timeline[sideIdx][timeline[sideIdx].length - 1] || timeline[sideIdx][timeline[sideIdx].length - 1] || { top: - margin };

      let top = last.top + margin;
      const element = {
        row: (sideIdx === 0 ? 'left' : 'right') as any,
        top,
        height: Math.random() * height + height,
        ...event
      };

      timeline[sideIdx].push(element);
    });
    return timeline;
  }

  private init(len: number) {
    this.events = new Array(len).fill(null).map((_, idx) => ({
      title: 'test ' + idx,
      desc: 'test description',
      img: 'https://picsum.photos/50/50/?random',
      date: this.randomDate()
    }));
  }

  private randomDate() {
    const start = new Date(2000, 0, 1);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  ngOnInit() { }
}
