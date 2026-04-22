import { Injectable } from '@angular/core';
import { PropertyRestService } from './property-rest.service';
import { SearchModel } from '../../navbar/search/model/search.model';
import { Observable } from 'rxjs';
import { PropertyResponse } from '../integration/response/property.response';
import { PropertyModel } from '../models/property.model';
import { filter, map } from 'rxjs/operators';
import { PropertyMapper } from '../mapper/property.mapper';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyDetailsModel } from '../models/property-details.model';
import { StorageEnum } from '../../shared/storage.enum';
import { PartnerModel } from 'src/app/shared/model/partner.model';
import { PartnerRestService } from 'src/app/shared/services/partner-rest.service';
import { PartnerMapper } from 'src/app/shared/mapper/partner.mapper';

@Injectable()
export class PropertyService {

  constructor(
    private rest: PropertyRestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private partnerRest: PartnerRestService
  ) { }

  public getProperty(code: number): Observable<PropertyDetailsModel> {
    return this.rest.getProperty(code).pipe(
      map(response => PropertyMapper.mapPropertyDetailsResponseToModel(response))
    );
  }

  public getProperties(filters: SearchModel): Observable<PropertyModel[]> {
    filters.showSite = 1;

    return this.rest.getProperties(filters)
      .pipe(
        map(response => PropertyMapper.mapPropertiesArrayResponseToModel(response))
      );
  }

  public getPropertiesCounter(filters: SearchModel): Observable<number> {
    filters.showSite = 1;

    return this.rest.getPropertiesCounter(filters);
  }

  public getPropertyImages(code: number): Observable<string[]> {
    return this.rest.getPropertyImages(code);
  }

  public getPropertyImage(path: string | null): string {
    if (path) {
      return `${environment.cdn}/${path}`;
    } else {
      return `./assets/images/imovel-sem-imagem.png`;
    }
  }

  get filteredTransaction(): number {
    return JSON.parse(localStorage.getItem(StorageEnum.FILTERS)).finality;
  }

  public getPartners(): Observable<PartnerModel[]> {
    return this.partnerRest.getPartners().pipe(
      map(response => PartnerMapper.mapPartnersArrayResponseToModel(response))
    );
  }

}
