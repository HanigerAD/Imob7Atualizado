import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable()
export class ContactsRestService {

  public contactUrl = environment.endpoint.contact;

  constructor(
      private http: HttpClient
  ) { }

  public sendMessage(message: any): Observable<void> {
    return this.http.post<void>(`${this.contactUrl}/message`, message);
  }

}
