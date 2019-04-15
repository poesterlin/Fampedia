import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, share, throttleTime } from 'rxjs/operators';
import { Router } from '@angular/router';


enum Direction {
  Up = 'Up',
  Down = 'Down',
  Not_Moved = 'Not Moved'
}

@Component({
  selector: 'fampedia-tool-header',
  templateUrl: './tool-header.component.html',
  styleUrls: ['./tool-header.component.scss'],
  animations: [
    trigger('mode', [
      state('hidden', style({ opacity: 0, transform: 'translateY(-100%)', position: 'fixed', })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)', position: 'fixed', })),
      state('normal', style({ opacity: 1, transform: 'translateY(0)', position: 'relative', })),
      transition('hidden => visible', animate('200ms ease-in')),
      transition('visible => hidden', animate('200ms ease-in'))
    ])
  ]
})
export class ToolHeaderComponent implements AfterViewInit {
  private state: 'normal' | 'visible' | 'hidden' = 'normal';

  constructor(private router: Router) { }

  @HostBinding('@mode')
  get mode(): 'normal' | 'visible' | 'hidden' {
    return this.state;
  }

  ngAfterViewInit() {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(5),
      map(() => window.pageYOffset),
      pairwise(),
      map(([y1, y2]): Direction => y2 < 200 ? Direction.Not_Moved : y2 < y1 ? Direction.Up : Direction.Down),
      distinctUntilChanged(),
      share()
    );

    const NotMoved$ = scroll$.pipe(
      filter(direction => direction === Direction.Not_Moved)
    );

    const goingUp$ = scroll$.pipe(
      filter(direction => direction === Direction.Up)
    );

    const goingDown$ = scroll$.pipe(
      filter(direction => direction === Direction.Down)
    );

    NotMoved$.subscribe(() => (this.state = 'normal'));
    goingUp$.subscribe(() => (this.state = 'visible'));
    goingDown$.subscribe(() => (this.state = 'hidden'));
  }

  public goTo(s: string) {
    this.router.navigate(s.split('/'));
  }
}
