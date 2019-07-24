import { ChangeDetectionStrategy, Component } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { FindBookPageActions } from '@example-app/books/actions';
import { Book } from '@example-app/books/models';
import * as fromBooks from '@example-app/books/reducers';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'bc-find-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-search
      [query]="initialQuery$ | async"
      [searching]="loading$ | async"
      [error]="error$ | async"
      (search)="search($event)">
    </bc-book-search>

    <bc-book-search-pagination
      [disabled]="!(searchQuery$ | async)"
      [total]="total$ | async"
      [page]="page$ | async"
      [perPage]="perPage$ | async"
      (pageChanged)="onPageChanged($event)">
    </bc-book-search-pagination>

    <bc-book-preview-list
      [books]="books$ | async">
    </bc-book-preview-list>
  `,
})
export class FindBookPageComponent {
  searchQuery$ = this.store.pipe(select(fromBooks.getSearchQuery));
  initialQuery$ = this.searchQuery$.pipe(take(1));
  books$ = this.store.pipe(select(fromBooks.getSearchResults));
  total$ = this.store.pipe(select(fromBooks.getSearchTotal));
  page$ = this.store.pipe(select(fromBooks.getPage));
  perPage$ = this.store.pipe(select(fromBooks.getPerPage));
  loading$ = this.store.pipe(select(fromBooks.getSearchLoading));
  error$ = this.store.pipe(select(fromBooks.getSearchError));

  constructor(private store: Store<fromBooks.State>) {}

  search(query: string) {
    this.store.dispatch(FindBookPageActions.searchBooks({ query }));
  }

  onPageChanged({ pageIndex: page, pageSize: perPage }: PageEvent) {
    this.store.dispatch(
      FindBookPageActions.searchPageChange({ page, perPage })
    );
  }
}
