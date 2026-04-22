import {Component, Input, OnInit} from '@angular/core';
import {LoginModel} from '../shared/model/login.model';
import {ConfigurationModel} from '../shared/model/configuration.model';
import {StorageEnum} from '../shared/storage.enum';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input()
  public siteInfo: ConfigurationModel;

  @Input()
  public siteLogo: string;


  constructor() { }

  ngOnInit(): void {
  }

  get banner(): string {
    const banner = JSON.stringify(localStorage.getItem(StorageEnum.BANNER));
    return `background-image:url(${banner});`;
  }

}
