import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  token: string;
  username: string;
  expireDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public readonly user$: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

  constructor() { }


  public isLoggedIn() {
    const user = this.user$.getValue();
    // TODO: check date
    return !!user;
  }
}
