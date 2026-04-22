import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../shared/integration/request/login.request';
import { LoginResponse } from '../shared/integration/response/login.response';
import {ConfigurationResponse} from '../shared/integration/response/configuration.response';


@Injectable()
export class AppRestService {

  private authEndpoint: string = environment.endpoint.auth;
  private configurationEndpoint: string = environment.endpoint.configuration;
  private bannerEndpoint: string = environment.endpoint.banner;
  private sobreNosBannerEndpoint: string = environment.endpoint.sobreNosBannerEndpoint;

  constructor(
      private http: HttpClient
  ) { }

  public loginAPI(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authEndpoint}/login`, request);
  }

  get siteConfiguration(): Observable<ConfigurationResponse> {
    return this.http.get<ConfigurationResponse>(`${this.configurationEndpoint}/site`);
  }

  get siteBanner(): Observable<any> {
    return this.http.get<string>(`${this.bannerEndpoint}`);
  }
  
  get sobreNosBanner(): Observable<any> {
    return this.http.get<string>(`${this.sobreNosBannerEndpoint}`);
  }

}
