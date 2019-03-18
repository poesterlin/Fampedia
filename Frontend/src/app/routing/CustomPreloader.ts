import { PreloadingStrategy, Route } from '@angular/router';

import { Observable, of, from } from 'rxjs';

export class CustomPreloader implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    const loadRoute: Observable<any> | Function = (delay?: number) =>
      delay
        ? from(
            new Promise(res =>
              setTimeout(() => {
                load();
                console.log('delayed preload', route);
                res();
              }, delay * 1000)
            )
          )
        : load();

    return route.data && route.data.preload
      ? loadRoute(route.data.delay)
      : of(null);
  }
}
