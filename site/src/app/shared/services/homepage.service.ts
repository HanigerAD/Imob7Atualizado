import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HomepageRestService } from './homepage-rest.service';
import { environment } from '../../../environments/environment';
import {LoginModel} from '../model/login.model';
import {ConfigurationMapper} from '../mapper/configurationMapper';
import {LoginRequest} from '../integration/request/login.request';
import {PostModel} from '../../homepage/model/post.model';
import {HomepageMapper} from '../../homepage/homepage.mapper';
import {ConfigurationModel} from '../model/configuration.model';

@Injectable()
export class HomepageService {

  constructor(
      private restService: HomepageRestService
  ) { }

  get siteConfiguration(): Observable<ConfigurationModel> {
    return this.restService.siteConfiguration
        .pipe(
            map(response => ConfigurationMapper.mapResponseToModel(response))
        );
  }

  public getImage(filePath: string): string {
    return `${environment.cdn}/${filePath}`;
  }

  public getPosts(): Observable<PostModel[]> {
    return this.restService.getPosts()
        .pipe(
            map(posts => HomepageMapper.mapPostResponseArrayToModel(posts))
        );
  }

}
