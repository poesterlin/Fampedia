import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface TimelineElement {
  top: number;
  height: number;
  title: string;
  desc: string;
  img: string;
  row: 'left' | 'right';
  date: Date;
  id: number;
}

@Component({
  selector: 'fampedia-timeline-element',
  templateUrl: './timeline-element.component.html',
  styleUrls: ['./timeline-element.component.scss']
})
export class TimelineElementComponent implements OnInit {
  @Input() element!: TimelineElement;
  public rand = Math.random();

  constructor(private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit() {}

  @HostBinding('style')
  public get style(): SafeStyle {
    const style = `top: ${this.element.top}px; height:${this.element.height}px;`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }


  public goToEvent() {
    this.router.navigate(['/moment/', this.element.id]);
  }
}
