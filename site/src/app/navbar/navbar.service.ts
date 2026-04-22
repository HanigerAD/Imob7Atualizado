import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {SearchModel} from './search/model/search.model';
import {Builder} from 'builder-pattern';
import {PropertyZoneEnum} from './search/enum/property-zone.enum';
import { PropertyTypeEnum } from './search/enum/property-type.enum';

@Injectable()
export class NavbarService {

  constructor(
      private router: Router
  ) { }

  get homepageOn(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  get buyFilter(): SearchModel {
    return Builder<SearchModel>()
        .zone(0)
        .finality(1)
        .city(0)
        .neighborhood([0])
        .type(0)
        .maxPrice(10000000)
    .build();
  }

  get rentFilter(): SearchModel {
    return Builder<SearchModel>()
        .zone(0)
        .finality(2)
        .city(0)
        .neighborhood([0])
        .type(0)
        .maxPrice(10000000)
      .build();
  }

  get countryFilter(): SearchModel {
    return Builder<SearchModel>()
        .finality(0)
        .type(0)
        .zone(PropertyZoneEnum.RURAL)
        .city(0)
        .neighborhood([0])
        .maxPrice(10000000)
    .build();
  }

  get enterpriseFilter(): SearchModel {
    return Builder<SearchModel>()
        .finality(0)
        .type(PropertyTypeEnum.EMPREENDIMENTO)
        .zone(PropertyZoneEnum.URBAN)
        .city(0)
        .neighborhood([0])
        .maxPrice(10000000)
        .financeable(1)
    .build();
  }
}
