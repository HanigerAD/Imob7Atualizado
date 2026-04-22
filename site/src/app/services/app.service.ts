import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppRestService } from './app-rest.service';
import { LoginModel } from '../shared/model/login.model';
import { LoginRequest } from '../shared/integration/request/login.request';
import { ConfigurationMapper } from '../shared/mapper/configurationMapper';
import { environment } from '../../environments/environment';
import { StorageEnum } from '../shared/storage.enum';
import { ConfigurationModel } from '../shared/model/configuration.model';

@Injectable()
export class AppService {

  constructor(
    private restService: AppRestService
  ) { }

  get siteConfiguration(): Observable<ConfigurationModel> {
    return this.restService.siteConfiguration
      .pipe(
        map(response => ConfigurationMapper.mapResponseToModel(response))
      );
  }

  get siteBanner(): Observable<string> {
    return this.restService.siteBanner.pipe(
        map(banner => `${environment.cdn}/${banner[0].image}`)
    );
  }

  get siteBanners(): Observable<string[]> {
    return this.restService.siteBanner.pipe(
      map(banners => banners.map(banner => `${environment.cdn}/${banner.image}`))
    );
  }
  
  get sobreNosBanners(): Observable<string[]> {
    return this.restService.sobreNosBanner.pipe(
      map(banners => banners.map(banner => `${environment.cdn}/${banner.image}`))
    );
  }

  public saveSiteInfoStorage(siteInfo: ConfigurationModel): void {
    localStorage.setItem(StorageEnum.SITE_INFO, JSON.stringify(siteInfo));
  }

  public getSiteLogo(logoFile: string): string {
    return `${environment.cdn}/${logoFile}`;
  }

}
