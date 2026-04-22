import { Injectable } from '@angular/core';
import {ConfigurationModel} from '../../../shared/model/configuration.model';
import {StorageEnum} from '../../../shared/storage.enum';
import {Observable} from 'rxjs';
import {ContactsRestService} from './contacts-rest.service';

@Injectable()
export class ContactsService {

  constructor(
      private rest: ContactsRestService
  ) { }

  public sendMessage(message: any): Observable<void> {
    return this.rest.sendMessage(message);
  }

  get siteInfoStorage(): ConfigurationModel {
    return JSON.parse(localStorage.getItem(StorageEnum.SITE_INFO));
  }
}
