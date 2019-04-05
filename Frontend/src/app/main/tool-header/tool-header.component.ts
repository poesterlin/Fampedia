import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { fromEvent } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  throttleTime
} from 'rxjs/operators';

enum VisibilityState {
  Visible = 'visible',
  Hidden = 'hidden',
  Normal = 'normal'
}

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
    trigger('toggle', [
      state(
        VisibilityState.Hidden,
        style({
          opacity: 0,
          transform: 'translateY(-100%)',
          position: 'fixed',
        })
      ),
      state(
        VisibilityState.Visible,
        style({
          opacity: 1,
          transform: 'translateY(0)',
          position: 'fixed',
        })
      ),
      state(
        VisibilityState.Normal,
        style({
          opacity: 1,
          transform: 'translateY(0)',
          position: 'relative',
        })
      ),
      transition('* => *', animate('200ms ease-in'))
    ])
  ]
})
export class ToolHeaderComponent implements AfterViewInit {
  private state: VisibilityState = VisibilityState.Normal;

  @HostBinding('@toggle')
  get toggle(): VisibilityState {
    return this.state;
  }

  ngAfterViewInit() {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(5),
      map(() => window.pageYOffset),
      pairwise(),
      map(
        ([y1, y2]): Direction =>
          y2 < 200
            ? Direction.Not_Moved
            : y2 < y1
            ? Direction.Up
            : Direction.Down
      ),
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

    NotMoved$.subscribe(() => (this.state = VisibilityState.Normal));
    goingUp$.subscribe(() => (this.state = VisibilityState.Visible));
    goingDown$.subscribe(() => (this.state = VisibilityState.Hidden));
  }
}
