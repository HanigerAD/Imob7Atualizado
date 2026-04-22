import { Component, Input, OnInit } from '@angular/core';
import { LoginModel } from '../shared/model/login.model';
import { NavbarService } from './navbar.service';
import { Router } from '@angular/router';
import { SearchService } from './search/services/search.service';
import { StorageEnum } from '../shared/storage.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input()
  public siteInfo: LoginModel;

  @Input()
  public siteLogo: string;

  public homepageOn = false;
  public navbarIsCollapsed = false;

  constructor(
    private service: NavbarService,
    private router: Router,
    private searchService: SearchService
  ) { }

  public ngOnInit(): void {
    this.verifyIsHomepage();
    this.scrollToTop();
    this.router.events.subscribe(
      () => this.verifyIsHomepage()
    );
  }
  
  public scrollToTop(): void {
    window.scroll(0, 0);
  }

  private verifyIsHomepage(): void {
    const url = this.router.url;
    this.homepageOn = url === '/' || url === '/home';
  }

  public redirectToHome(): void {
    this.router.navigateByUrl('/home');
    this.navbarIsCollapsed = false;
  }

  public redirectToAboutUs(): void {
    this.router.navigateByUrl('/sobre-nos');
    this.navbarIsCollapsed = false;
  }

  public redirectToProperties(): void {
    if (this.router.url.toString() === '/listando-imoveis') {
      window.location.reload();
    }

    this.router.navigateByUrl('/listando-imoveis');
    this.navbarIsCollapsed = false;
  }

  public redirectToServices(): void {
    this.router.navigateByUrl('/servicos');
    this.navbarIsCollapsed = false;
  }

  public redirectToPartners(): void {
    this.router.navigateByUrl('/parceiros');
    this.navbarIsCollapsed = false;
  }

  public redirectToSellYourProperty(): void {
    this.router.navigateByUrl('/comercialize-seu-imovel');
    this.navbarIsCollapsed = false;
  }

  public redirectToNews(): void {
    this.router.navigateByUrl('/noticias');
    this.navbarIsCollapsed = false;
  }

  public redirectToContacts(): void {
    this.router.navigateByUrl('/contatos');
    this.navbarIsCollapsed = false;
  }

  public redirectToBuy(): void {
    this.searchService.saveFiltersStorage(this.service.buyFilter);
    this.redirectToProperties();
    this.navbarIsCollapsed = false;
  }
  
  public redirectToEnterprise(): void {
    this.searchService.saveFiltersStorage(this.service.enterpriseFilter);
    this.redirectToProperties();
    this.navbarIsCollapsed = false;
  }

  public redirectToRent(): void {
    this.searchService.saveFiltersStorage(this.service.rentFilter);
    this.redirectToProperties();
    this.navbarIsCollapsed = false;
  }

  public redirectToCountry(): void {
    this.searchService.saveFiltersStorage(this.service.countryFilter);
    this.redirectToProperties();
    this.navbarIsCollapsed = false;
  }

  public collapseNavbar(): void {
    this.navbarIsCollapsed = !this.navbarIsCollapsed;
  }

  get banners() {
    return JSON.parse(localStorage.getItem(StorageEnum.BANNERS)) || [];
  }
}
