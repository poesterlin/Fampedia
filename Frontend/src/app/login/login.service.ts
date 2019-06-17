import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { IUser } from '../core/Interfaces/IUser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public readonly user$: BehaviorSubject<IUser | undefined> = new BehaviorSubject<IUser | undefined>(undefined);

  constructor(private storage: StorageService, private router: Router) {
    const user = this.storage.getSettingAsObject<IUser>('userdata');
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

  public logout(){
    this.user$.next(undefined);    
    this.router.navigate(['login']);
  }
}
