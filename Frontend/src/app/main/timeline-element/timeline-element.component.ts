import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

export interface TimelineElement {
  top: number;
  height: number;
  title: string;
  desc: string;
  img: string;
  row: 'left' | 'right';
  date: Date;
}

@Component({
  selector: 'fampedia-timeline-element',
  templateUrl: './timeline-element.component.html',
  styleUrls: ['./timeline-element.component.scss']
})
export class TimelineElementComponent implements OnInit {
  @Input() element!: TimelineElement;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  @HostBinding('style')
  public get style(): SafeStyle {
    const style = `top: ${this.element.top}px; height:${this.element.height};`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
