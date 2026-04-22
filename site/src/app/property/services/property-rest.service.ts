import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import { SearchModel } from '../../navbar/search/model/search.model';
import { PropertyResponse } from '../integration/response/property.response';
import { PropertyDetailsResponse } from '../integration/response/property-details.response';

@Injectable()
export class PropertyRestService {

  private endpoint: string = environment.endpoint.property;

  constructor(
      private http: HttpClient
  ) { }

  public getProperty(code: number): Observable<PropertyDetailsResponse> {
    return this.http.get<any>(`${this.endpoint}/properties/${code}`);
  }

  public getPropertyImages(code: number): Observable<string[]> {
    return this.http.get<any>(`${this.endpoint}/properties/${code}/images/urls`);
  }

  public getProperties(filters: SearchModel): Observable<PropertyResponse[]> {
    let params: HttpParams = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(filter => {
        if (filters[filter]) {
          if (filter === 'neighborhood') {
            params = params.append(filter, JSON.stringify(filters[filter]));
          } else {
            params = params.append(filter, filters[filter]);
          }
        }
      });
    }

    return this.http.get<any>(`${this.endpoint}/properties`, { params });
  }

  public getPropertiesCounter(filters: SearchModel): Observable<number> {
    let params: HttpParams = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(filter => {
        if (filters[filter]) {
          if (filter === 'neighborhood') {
            params = params.append(filter, JSON.stringify(filters[filter]));
          } else {
            params = params.append(filter, filters[filter]);
          }
        }
      });
    }

    return this.http.get<any>(`${this.endpoint}/counter/properties`, { params });
  }

}
