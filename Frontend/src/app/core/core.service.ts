import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Moment } from './Entitys/Moment';
import { environment } from 'src/environments/environment';

interface HttpOptions {
  authorization?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  constructor(private http: HttpClient) { }



  public updateMoment(moment: Moment) {
    // TODO: Implement
    // dont forget to subscribe somewhere
    return this.post("momenturl", moment)
  }
  
  
  public getMoments() {
    // TODO: Implement
    // dont forget to subscribe somewhere
    return this.get("momenturl")
  }


  private get(uri: string, config: HttpOptions = {}) {
    return this.http.get(this.url + "/" + uri, this.makeOptions(config))
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
