import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export enum FamilyMode {
  initial, join, joinAvaliable, joinNotAvaliable, createNew
}

@Injectable()
export class RegisterService {
  public readonly familyMode: BehaviorSubject<FamilyMode> = new BehaviorSubject<FamilyMode>(FamilyMode.initial);
  public familyId?: string;

  constructor() { }
}
