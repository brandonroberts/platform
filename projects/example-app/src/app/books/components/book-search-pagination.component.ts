import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'bc-book-search-pagination',
  template: `
    <mat-paginator
      [disabled]="disabled"
      [length]="total"
      [pageIndex]="page"
      [pageSize]="perPage"
      [pageSizeOptions]="pageSizeOptions"
      (page)="onPage($event)">
    </mat-paginator>
  `,
})
export class BookSearchPaginationComponent implements OnInit {
  @Input() total: number;
  @Input() perPage: number = 40;
  @Input() page = 0;
  @Input() disabled = false;
  private pageSizeOptions = [10, 20, 30, 40];

  @Output() pageChanged = new EventEmitter<PageEvent>();

  constructor() {}

  ngOnInit() {}

  onPage(event: PageEvent) {
    this.pageChanged.emit(event);
  }
}
