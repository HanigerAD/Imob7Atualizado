import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {CityResponse} from '../integration/response/city.response';
import {NeighborhoodResponse} from '../integration/response/neighborhood.response';
import {TypeResponse} from '../integration/response/type.response';
import {FinalityResponse} from '../integration/response/finality.response';
import {ZoneResponse} from '../integration/response/zone.response';

@Injectable()
export class SearchRestService {

  private endpointLocality: string = environment.endpoint.locality;
  private endpointProperty: string = environment.endpoint.property;

  constructor(
      private http: HttpClient
  ) { }

  public getFinalities(): Observable<FinalityResponse[]> {
    return this.http.get<FinalityResponse[]>(`${this.endpointProperty}/transactions`);
  }

  public getZones(): Observable<ZoneResponse[]> {
    return this.http.get<TypeResponse[]>(`${this.endpointProperty}/zones`);
  }

  public getTypes(): Observable<TypeResponse[]> {
    return this.http.get<TypeResponse[]>(`${this.endpointProperty}/types`);
  }

  public getCities(): Observable<CityResponse[]> {
    return this.http.get<CityResponse[]>(`${this.endpointLocality}/city`);
  }

  public getNeighborhoods(cityCode: number): Observable<NeighborhoodResponse[]> {
    return this.http.get<NeighborhoodResponse[]>(`${this.endpointLocality}/city/${cityCode}/neighborhoods`);
  }

}
