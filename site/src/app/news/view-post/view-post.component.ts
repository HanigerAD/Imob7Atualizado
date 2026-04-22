import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { NewsService } from '../service/news.service';
import { PostModel } from '../../homepage/model/post.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import {StorageEnum} from '../../shared/storage.enum';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit, OnDestroy {

  public post: PostModel;
  public posts: PostModel[] = [];
  public termToFilter = '';

  private subscriptions: Subscription = new Subscription();
  public searchForm: FormGroup;

  constructor(
      private service: NewsService,
      private activatedRoute: ActivatedRoute,
      private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.getPostCode();
    this.getPosts();
    this.searchForm = this.generateSearchForm();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getPostCode(): void {
    this.subscriptions.add(
        this.activatedRoute.params.subscribe(
            params => this.getPost(params.code)
        )
    );
  }

  private getPost(code: number): void {
    this.subscriptions.add(
        this.service.getPost(code).subscribe(
            post => this.post = post
        )
    );
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

  public getFormatedDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  public getImage(path: string): string {
    return this.service.getImage(path);
  }

  public redirectToHome(): void {
    this.service.redirectToHome();
  }

  public redirectToBlog(): void {
    this.service.redirectToBlog();
  }

  public viewPost(code: number): void {
    this.service.seePost(code);
  }

  get banner(): string {
    const banner = JSON.stringify(localStorage.getItem(StorageEnum.BANNER));
    return `background-image:url(${banner});`;
  }

}
