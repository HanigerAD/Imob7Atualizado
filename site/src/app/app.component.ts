import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from './services/app.service';
import { LoginModel } from './shared/model/login.model';
import { ConfigurationModel } from './shared/model/configuration.model';
import { StorageEnum } from './shared/storage.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public loading = true;
  public subscriptions: Subscription = new Subscription();
  public siteInfo: ConfigurationModel;
  public siteLogo = '';
  public siteBanner = '';
  public siteBanners = [];
  public sobreNosBanners = [];

  constructor(
    private service: AppService
  ) {
  }

  public ngOnInit(): void {
    this.getSiteConfiguration();
    this.getSiteBanner();
    this.getSiteBanners();
    this.getSobreNosBanners();
  }

  private getSiteConfiguration(): void {
    this.subscriptions.add(
      this.service.siteConfiguration.subscribe(
        siteInfo => this.manageSuccessLoginAPI(siteInfo)
      )
    );
  }

  private getSiteBanner(): void {
    this.subscriptions.add(
      this.service.siteBanner.subscribe(
        banner => {
          this.siteBanner = banner;
          localStorage.setItem(StorageEnum.BANNER, banner);
        }
      )
    );
  }

  private getSiteBanners(): void {
    this.subscriptions.add(
      this.service.siteBanners.subscribe(
        banners => {
          this.siteBanners = banners;
          localStorage.setItem(StorageEnum.BANNERS, JSON.stringify(banners));
        }
      )
    );
  }

  private getSobreNosBanners(): void {
    this.subscriptions.add(
      this.service.sobreNosBanners.subscribe(
        banners => {
          this.sobreNosBanners = banners;
          localStorage.setItem(StorageEnum.SOBRE_NOS_BANNERS, JSON.stringify(banners));
        }
      )
    );
  }

  private manageSuccessLoginAPI(siteInfo: ConfigurationModel): void {
    this.siteInfo = siteInfo;
    this.siteLogo = this.service.getSiteLogo(siteInfo.logo);
    this.service.saveSiteInfoStorage(siteInfo);
    this.loading = false;
  }

}
