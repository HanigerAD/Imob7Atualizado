import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {SellYourPropertyRestService} from './sell-your-property-rest.service';

@Injectable()
export class SellYourPropertyService {

  constructor(
      private rest: SellYourPropertyRestService
  ) { }

  public sendNewProperty(emailData: any): Observable<void> {
    return this.rest.sendNewProperty(emailData);
  }
}
