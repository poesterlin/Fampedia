import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Moment } from './Entitys/Moment';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { IMoment, MomentCreated } from './Interfaces/IMoment';

interface HttpOptions {
  headers?: { key: string, value: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  constructor(private http: HttpClient) { }

  public addMomentImage(description: string, momentID: number, file: Blob) {
    const formdata = new FormData();
    formdata.append('image', file);
    return this.post(`momentimage/addimage/${momentID}`, formdata, { headers: [{ key: 'desc', value: description }] });
  }

  public updateMoment(moment: Moment) {
    return this.post(`moment/edit`, moment)
  }

  public addMoment(title: string, description: string, date: Date = new Date()) {
    return this.post<MomentCreated>(`moment/new`, { title, description, date }) 
  }

  public getMoments() {
    return this.get<IMoment[]>(`moment/all`).pipe(map(momentJSON => momentJSON.map(json => new Moment(json))))
  }

  public login(username: string, password: string) {
    return this.post(`user/login`, { "un": username, "pw": password })
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
