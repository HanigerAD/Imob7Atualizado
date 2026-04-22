import { Injectable } from '@angular/core';
import {SearchRestService} from './search-rest.service';
import {Observable} from 'rxjs';
import {CityModel} from '../model/city.model';
import {map} from 'rxjs/operators';
import {FiltersMapper} from '../mapper/filters.mapper';
import {NeighborhoodModel} from '../model/neighborhood.model';
import {Router} from '@angular/router';
import {StorageEnum} from '../../../shared/storage.enum';
import {SearchModel} from '../model/search.model';
import {TypeModel} from '../model/type.model';
import {FinalityModel} from '../model/finality.model';
import {ZoneModel} from '../model/zone.model';

@Injectable()
export class SearchService {

  constructor(
      private restService: SearchRestService,
      private router: Router
  ) { }

  public getFinalities(): Observable<FinalityModel[]> {
    return this.restService.getFinalities()
        .pipe(
            map(finalities => FiltersMapper.mapFinalitiesArrayResponseToModel(finalities))
        );
  }

  public getZones(): Observable<ZoneModel[]> {
    return this.restService.getZones()
        .pipe(
            map(zones => FiltersMapper.mapZonesArrayResponseToModel(zones))
        );
  }

  public getTypes(): Observable<TypeModel[]> {
    return this.restService.getTypes()
        .pipe(
            map(types => FiltersMapper.mapTypesArrayResponseToModel(types))
        );
  }

  public getCities(): Observable<CityModel[]> {
    return this.restService.getCities()
        .pipe(
            map(cities => FiltersMapper.mapCitiesArrayResponseToModel(cities))
        );
  }

  public getNeighborhoods(cityCode: number): Observable<NeighborhoodModel[]> {
    return this.restService.getNeighborhoods(cityCode)
        .pipe(
            map(neighborhoods => FiltersMapper.mapNeighborhoodsArrayResponseToModel(neighborhoods))
        );
  }

  public saveFiltersStorage(filters: SearchModel): void {   
    localStorage.setItem(StorageEnum.FILTERS, JSON.stringify(filters));
  }

  public redirectToListProperties(): void {
    this.router.navigateByUrl('/listando-imoveis');
  }

}
