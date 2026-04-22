import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { PostResponse } from '../../homepage/integration/response/post.response';
import { environment } from '../../../environments/environment';

@Injectable()
export class NewsRestService {

  private blogEndpoint: string = environment.endpoint.blog;

  constructor(
      private http: HttpClient
  ) { }

  public getPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.blogEndpoint}/posts`);
  }

  public getPost(code: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.blogEndpoint}/posts/${code}`);
  }

}
