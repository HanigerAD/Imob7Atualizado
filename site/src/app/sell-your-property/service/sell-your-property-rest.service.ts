import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class SellYourPropertyRestService {

  private contactEndpoint: string = environment.endpoint.contact;

  constructor(
      private http: HttpClient
  ) { }

  public sendNewProperty(newProperty: any): Observable<void> {
    return this.http.post<void>(`${this.contactEndpoint}/new-property`, newProperty);
  }

}
