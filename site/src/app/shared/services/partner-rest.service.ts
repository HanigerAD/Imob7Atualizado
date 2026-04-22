import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PartnerResponse } from '../integration/response/partner.response';

@Injectable()
export class PartnerRestService {

  private endpoint: string = environment.endpoint.partner;

  constructor(
    private http: HttpClient
  ) { }

  public getPartner(code: number): Observable<PartnerResponse> {
    return this.http.get<any>(`${this.endpoint}/${code}`);
  }

  public getPartners(): Observable<PartnerResponse[]> {
    let params: HttpParams = new HttpParams();

    return this.http.get<any>(`${this.endpoint}`, { params });
  }

}
