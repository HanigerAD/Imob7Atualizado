import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {LoginRequest} from '../integration/request/login.request';
import {LoginResponse} from '../integration/response/login.response';
import {PostResponse} from '../../homepage/integration/response/post.response';
import {ConfigurationResponse} from '../integration/response/configuration.response';

@Injectable()
export class HomepageRestService {

  private authEndpoint: string = environment.endpoint.auth;
  private blogEndpoint: string = environment.endpoint.blog;
  private configurationEndpoint: string = environment.endpoint.configuration;

  constructor(
      private http: HttpClient
  ) { }

  public loginAPI(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authEndpoint}/login`, request);
  }

  public getPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.blogEndpoint}/posts`);
  }

  get siteConfiguration(): Observable<ConfigurationResponse> {
    return this.http.get<ConfigurationResponse>(`${this.configurationEndpoint}/site`);
  }

}
