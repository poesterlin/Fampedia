import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Moment } from './Entitys/Moment';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { IMoment } from './Interfaces/IMoment';

interface HttpOptions {
  authorization?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  constructor(private http: HttpClient) { }



  public addMomentImage(description: String, momentID: BigInteger) {
    return this.post(`momentimage/addimage/${momentID}`, { 'desc': description })
  }

  public updateMoment(moment: Moment) {
    return this.post(`moment/edit`, moment)
  }

  public addMoment(momenttitle: String, momentdescription: String) {
    return this.post(`moment/new`, { momenttitle, momentdescription })
  }

  public getMoments() {
    return this.get<IMoment[]>(`moment/all`).pipe(map(momentJSON => momentJSON.map(json => new Moment(json))))
  }

  public login(username: String, password: String) {
    return this.post(`user/login`, { "un": username, "pw": password })
  }


  private get<T>(uri: string, config: HttpOptions = {}) {
    return this.http.get<T>(this.url + "/" + uri, this.makeOptions(config))
  }

  private post(uri: string, body: any, config: HttpOptions = {}) {
    return this.http.post(this.url + "/" + uri, body, this.makeOptions(config))
  }

  private makeOptions(config: HttpOptions) {
    const options = {
      headers: new HttpHeaders(),
      params: new HttpParams()
    };
    if (config.authorization) {
      // TODO: Token stuff
      options.headers.set('Authorization', 'my-new-auth-token');
    }
    return options;
  }

  private get url() {
    return environment.url
  }
}
