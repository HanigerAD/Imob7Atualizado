import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PartnerMapper } from '../shared/mapper/partner.mapper';
import { PartnerModel } from '../shared/model/partner.model';
import { PartnerRestService } from '../shared/services/partner-rest.service';
import { StorageEnum } from '../shared/storage.enum';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
  public partners: PartnerModel[] = [];

  constructor(
    private router: Router,
    private partnerRest: PartnerRestService
  ) { }

  public ngOnInit(): void {
    this.getPartners();
  }

  public redirectToPartner(url: string): void {
    window.open(url, '_blank');
  }

  get banner(): string {
    const banner = JSON.stringify(localStorage.getItem(StorageEnum.BANNER));
    return `background-image:url(${banner});`;
  }

  public getPartners(): void {
    this.partnerRest.getPartners().pipe(
      map(response => PartnerMapper.mapPartnersArrayResponseToModel(response))
    ).subscribe(response => {
      this.partners = response;
    });
  }
}
