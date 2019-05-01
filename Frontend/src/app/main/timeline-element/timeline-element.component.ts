import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Moment } from 'src/app/core/Entitys/Moment';

export interface TimelineElement {
  top: number;
  height: number;
  row: 'left' | 'right';
  moment: Moment;
}

@Component({
  selector: 'fampedia-timeline-element',
  templateUrl: './timeline-element.component.html',
  styleUrls: ['./timeline-element.component.scss']
})
export class TimelineElementComponent implements OnInit {
  @Input() element!: TimelineElement;

  constructor(private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit() {}

  @HostBinding('style')
  public get style(): SafeStyle {
    const style = `top: ${this.element.top}px; height:${this.element.height}px;`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }


  public goToMoment() {
    this.router.navigate(['/moment/', this.element.moment.momentId]);
  }
}
