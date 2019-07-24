import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { asyncScheduler, EMPTY as empty, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  skip,
  switchMap,
  takeUntil,
  withLatestFrom,
  concatMap,
  tap,
  first,
} from 'rxjs/operators';

import {
  BooksApiActions,
  FindBookPageActions,
} from '@example-app/books/actions';
import { GoogleBooksService } from '@example-app/core/services/google-books.service';
import * as fromBooks from '../reducers';
import { select, Store } from '@ngrx/store';

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application.
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */

@Injectable()
export class BookEffects {
  search$ = createEffect(
    () => ({ debounce = 300, scheduler = asyncScheduler } = {}) =>
      this.actions$.pipe(
        ofType(FindBookPageActions.searchBooks),
        debounceTime(debounce, scheduler),
        switchMap(action => {
          if (action.query === '') {
            return empty;
          }

          const nextSearch$ = this.actions$.pipe(
            ofType(FindBookPageActions.searchBooks),
            skip(1)
          );

          return of(action).pipe(
            withLatestFrom(
              this.store.pipe(select(fromBooks.getPerPage)).pipe(first())
            ),
            concatMap(([action, perPage]) =>
              this.googleBooks.searchBooks(action.query, 0, perPage).pipe(
                takeUntil(nextSearch$),
                map(({ books, total }) =>
                  BooksApiActions.searchSuccess({
                    books,
                    total,
                    page: 0,
                    perPage,
                  })
                ),
                catchError(err =>
                  of(BooksApiActions.searchFailure({ errorMsg: err.message }))
                )
              )
            )
          );
        })
      )
  );

  changePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FindBookPageActions.searchPageChange),
      switchMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromBooks.getSearchQuery))),
          concatMap(([action, query]) =>
            this.googleBooks
              .searchBooks(query, action.page, action.perPage)
              .pipe(
                map(({ books, total }) =>
                  BooksApiActions.searchSuccess({
                    books,
                    total,
                    page: action.page,
                    perPage: action.perPage,
                  })
                ),
                catchError(err =>
                  of(BooksApiActions.searchFailure({ errorMsg: err.message }))
                )
              )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private googleBooks: GoogleBooksService,
    private store: Store<fromBooks.State>
  ) {}
}
