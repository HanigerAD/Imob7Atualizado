import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NewsRestService } from './news-rest.service';
import { PostModel } from '../../homepage/model/post.model';
import { HomepageMapper } from '../../homepage/homepage.mapper';
import { environment } from '../../../environments/environment';


@Injectable()
export class NewsService {

  constructor(
      private restService: NewsRestService,
      private router: Router
  ) { }

  public getPosts(): Observable<PostModel[]> {
    return this.restService.getPosts()
        .pipe(
            map(posts => HomepageMapper.mapPostResponseArrayToModel(posts))
        );
  }

  public getPost(code: number): Observable<PostModel> {
    return this.restService.getPost(code)
        .pipe(
            map(post => HomepageMapper.mapPostResponseToModel(post))
        );
  }

  public seePost(code: number): void {
    this.router.navigateByUrl(`/artigo/${code}`);
  }

  public redirectToHome(): void {
    this.router.navigateByUrl('/home');
  }

  public redirectToBlog(): void {
    this.router.navigateByUrl('/noticias');
  }

  public getImage(filePath: string): string {
    return `${environment.cdn}/${filePath}`;
  }

}
