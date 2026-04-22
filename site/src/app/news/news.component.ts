import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { PostModel } from '../homepage/model/post.model';
import { NewsService } from './service/news.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {StorageEnum} from '../shared/storage.enum';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {

  public posts: PostModel[] = [];
  public keywordToFilter = '';
  public termToFilter = '';

  private subscriptions: Subscription = new Subscription();
  public searchForm: FormGroup;

  constructor(
      private service: NewsService,
      private formBuilder: FormBuilder,
      private router: Router
  ) { }

  public ngOnInit(): void {
    this.getPosts();
    this.searchForm = this.generateSearchForm();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private generateSearchForm(): FormGroup {
    return this.formBuilder.group({
      search: null
    });
  }

  private getPosts(): void {
    this.subscriptions.add(
        this.service.getPosts().subscribe(
            posts => this.posts = posts
        )
    );
  }

  public seePost(code: number): void {
    this.service.seePost(code);
  }

  public getImage(path: string): string {
    return this.service.getImage(path);
  }

  public getFormatedDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  public filterByKeyword(keyword: string): void {
    this.keywordToFilter = keyword;
  }

  public searchArticle(): void {
    const search = this.searchForm.get('search').value;

    if (search) {
      this.termToFilter = search;
    } else {
      this.termToFilter = '';
    }

    this.keywordToFilter = '';
  }

  public viewPost(code: number): void {
    this.router.navigateByUrl(`/artigo/${code}`);
  }

  get postsList(): PostModel[] {

    if (this.keywordToFilter) {
      return this.posts.filter(post => post.keywords.some(keyword => keyword === this.keywordToFilter));
    }

    if (this.termToFilter) {
      return this.posts.filter(post => post.title.includes(this.termToFilter) || post.text.includes(this.termToFilter)
          || post.keywords.includes(this.termToFilter));
    }

    return this.posts;
  }

  get keywords(): string [] {
    let keywords = [];

    this.posts.forEach(post => {
      keywords = keywords.concat(post.keywords);
    });
    return keywords;
  }

  get banner(): string {
    const banner = JSON.stringify(localStorage.getItem(StorageEnum.BANNER));
    return `background-image:url(${banner});`;
  }

}
