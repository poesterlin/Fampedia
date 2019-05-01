import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';

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

  constructor(private storage: StorageService) {
    const user = this.storage.getSettingAsObject<User>('userdata');
    if (user) {
      user.expireDate = new Date(Date.parse(user.expireDate as any));
      this.user$.next(user);
    }
    this.user$.subscribe(user => {
      if (user) {
        this.storage.setSetting('userdata', user);
      }
    })
  }


  public isLoggedIn() {
    const user = this.user$.getValue();
    return user && new Date() < user.expireDate;
  }
}
