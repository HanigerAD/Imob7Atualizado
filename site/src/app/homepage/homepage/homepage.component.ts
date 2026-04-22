import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import {HomepageService} from '../../shared/services/homepage.service';
import {Options} from '@angular-slider/ngx-slider';
import {LoginModel} from '../../shared/model/login.model';
import {PropertyService} from '../../property/services/property.service';
import {FeaturedPropertiesMapper} from './mapper/featured-properties.mapper';
import {PropertyModel} from '../../property/models/property.model';
import {PostModel} from '../model/post.model';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {NewsService} from '../../news/service/news.service';
import {ConfigurationModel} from '../../shared/model/configuration.model';
import {StorageEnum} from '../../shared/storage.enum';
import { converterParaMoeda } from '../../shared/utils/parser.utils';
import { TransactionEnum } from 'src/app/shared/enum/transaction.enum';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {

  @Input()
  public siteInfo: ConfigurationModel;

  private subscriptions: Subscription = new Subscription();

  public featuredPropertiesToRent: PropertyModel[] = [];
  public featuredPropertiesToSell: PropertyModel[] = [];
  public posts: PostModel[] = [];

  public converterParaMoeda = converterParaMoeda;

  constructor(
      private service: HomepageService,
      private propertyService: PropertyService,
      private newsService: NewsService,
      private router: Router
  ) { }

  public ngOnInit(): void {
    this.getFeaturedProperties();
    this.getBlogPosts();
    this.getConfiguration();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public getConfiguration(): void {
    this.siteInfo = JSON.parse(localStorage.getItem(StorageEnum.SITE_INFO));
  }

  public getPropertyImage(path: string): string {
    return this.propertyService.getPropertyImage(path);
  }

  private getFeaturedProperties(): void {
    this.subscriptions.add(
        this.propertyService.getProperties(FeaturedPropertiesMapper.mapFilterFeaturedProperties(2)).subscribe(
            properties => {
              this.featuredPropertiesToRent = properties.filter(property => property.transaction == 'Aluguel');
            }
        )
    );

    this.subscriptions.add(
      this.propertyService.getProperties(FeaturedPropertiesMapper.mapFilterFeaturedProperties(1)).subscribe(
          properties => {
            this.featuredPropertiesToSell = properties.filter(property => property.transaction == 'Venda');
          }
      )
  );
  }

  private getBlogPosts(): void {
    this.subscriptions.add(
        this.service.getPosts().subscribe(
            posts => this.posts = posts.slice(0, 2)
        )
    );
  }

  public getImageUrl(pathFile: string): string {
    return this.service.getImage(pathFile);
  }

  public seePropertyDetails(code: number): void {
    this.router.navigateByUrl(`/detalhes-imovel/${code}`);
  }

  public getDate(date: string): string {
    return moment(date).format('DD/MM/YYYY HH:MM');
  }

  public seePost(code: number): void {
    this.newsService.seePost(code);
  }

  public redirectToPartners(): void {
    this.router.navigateByUrl('/parceiros');
  }

  get banner(): string {
    const banner = JSON.stringify(localStorage.getItem(StorageEnum.BANNER));
    return `background-image:url(${banner});`;
  }

}
