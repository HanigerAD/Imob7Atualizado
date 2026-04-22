import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {

  constructor() {
  }

  @Input()
  public totalRegisters;

  @Input()
  public registerPerPage;

  @Input()
  public actualPage = 1;

  @Output()
  public pageChanged = new EventEmitter<number>();

  public pages: number[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.totalRegisters) {
      this.generatePagesArray();
    }
  }

  get numberOfPages(): number {
    return Math.ceil(this.totalRegisters / this.registerPerPage);
  }

  public generatePagesArray(): void {
    this.pages = [];
    let i = 1;
    while (this.pages.length < this.numberOfPages) {
      this.pages.push(i);
      i++;
    }
  }

  public changePage(pageSelected: number): void {
    window.scroll(0, 0);
    this.actualPage = pageSelected;
    this.pageChanged.emit(pageSelected);
  }

}
