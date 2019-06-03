import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Moment } from './Entitys/Moment';
import { environment } from 'src/environments/environment';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';
import { IMoment, MomentCreated } from './Interfaces/IMoment';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { INews } from './Interfaces/IEvent';
import { IComment } from './Interfaces/IComment';
import { IFamilyFound } from './Interfaces/IFamily';
import { Member } from './Interfaces/IUser';

interface HttpOptions {
  headers?: { key: string, value: string }[];
}

export enum EUpdateType {
  comment = "comment", moment = "moment", news = "news"
}

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  public readonly moments$: BehaviorSubject<Moment[]> = new BehaviorSubject<Moment[]>([]);
  public readonly news$: BehaviorSubject<INews[]> = new BehaviorSubject<INews[]>([]);
  public readonly updatesAvaliable$: Subject<EUpdateType> = new Subject();

  constructor(private http: HttpClient) {

  }

  public filterFor(member: Member) {
    this.get<number[]>(`tagged/${member.id}`).subscribe(val => {
      this.moments$.next(this.moments$.getValue().filter(mom => val.includes(mom.momentId)))
    })
  }

  public addMomentImage(description: string, momentID: number, file: Blob) {
    const formdata = new FormData();
    formdata.append('image', file);
    return this.post(`momentimage/addimage/${momentID}`, formdata, { headers: [{ key: 'desc', value: description }] });
  }

  public updateMoment(moment: Moment) {
    return this.post(`moment/edit`, moment)
  }

  public addMoment(title: string, description: string, date: Date = new Date(), userIds: string[]) {
    return this.post<MomentCreated>(`moment/new`, { title, description, date }).pipe(tap((moment: MomentCreated) => {
      if (userIds.length > 0) {
        this.post(`moment/${moment.momentID}/tag`, { ids: userIds }).subscribe();
      }
    }));
  }

  public getMoments() {
    return this.get<IMoment[]>(`moment/all`).pipe(
      distinctUntilChanged(),
      map(momentJSON => momentJSON.map(json => new Moment(json))),
      tap((moments) => this.moments$.next(moments))
    )
  }

  public getComments(moment: number) {
    return this.get<IComment[]>(`moment/${moment}/comments`);
  }

  public postComment(moment: number, comment: string) {
    return this.post(`moment/${moment}/comment`, { desc: comment });
  }

  public getNews() {
    return this.get<INews[]>(`news`).pipe(
      distinctUntilChanged(),
      tap((news) => this.news$.next(news))
    )
  }

  public login(username: string, password: string) {
    return this.post(`user/login`, { "un": username, "pw": password })
  }

  public checkFamilyName(family: string): Observable<IFamilyFound> {
    return this.get<IFamilyFound>('user/family/' + family);
  }

  public registerFamily(name: string) {
    return this.post<{ familyId: string }>('user/family/new', { name });
  }

  public registerUser(un: string, pw: string, familyName: string) {
    return this.post('user/register', { un, pw, familyName })
  }


  private get<T>(uri: string, config: HttpOptions = {}) {
    return this.http.get<T>(this.url + "/" + uri, this.makeOptions(config))
  }

  private post<T>(uri: string, body: any, config: HttpOptions = {}) {
    return this.http.post<T>(this.url + "/" + uri, body, this.makeOptions(config))
  }

  private makeOptions(config: HttpOptions) {
    const options = {
      headers: new HttpHeaders(),
      params: new HttpParams()
    };
    if (config.headers) {
      config.headers.forEach(({ key, value }) => options.headers.set(key, value))
    }
    return options;
  }

  private get url() {
    return environment.url
  }
}
