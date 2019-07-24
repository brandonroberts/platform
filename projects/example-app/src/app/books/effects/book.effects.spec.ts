import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import {
  BooksApiActions,
  FindBookPageActions,
} from '@example-app/books/actions';
import { BookEffects } from '@example-app/books/effects';
import { Book } from '@example-app/books/models';
import { GoogleBooksService } from '@example-app/core/services/google-books.service';
import { provideMockStore } from '@ngrx/store/testing';
import * as fromBooks from '@example-app/books/reducers/books.reducer';
import * as fromSearch from '@example-app/books/reducers/search.reducer';

describe('BookEffects', () => {
  let effects: BookEffects;
  let googleBooksService: any;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookEffects,
        {
          provide: GoogleBooksService,
          useValue: { searchBooks: jest.fn() },
        },
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            books: {
              [fromSearch.searchFeatureKey]: fromSearch.initialState,
              [fromBooks.booksFeatureKey]: fromBooks.initialState,
            },
          },
        }),
      ],
    });

    effects = TestBed.get(BookEffects);
    googleBooksService = TestBed.get(GoogleBooksService);
    actions$ = TestBed.get(Actions);
  });

  describe('search$', () => {
    it('should return a book.SearchComplete, with the books, on success, after the de-bounce', () => {
      const book1 = { id: '111', volumeInfo: {} } as Book;
      const book2 = { id: '222', volumeInfo: {} } as Book;
      const books = [book1, book2];
      const action = FindBookPageActions.searchBooks({ query: 'query' });
      const completion = BooksApiActions.searchSuccess({
        books,
        page: 0,
        perPage: 40,
        total: books.length,
      });

      actions$ = hot('-a---', { a: action });
      const response = cold('-a|', { a: { books, total: books.length } });
      const expected = cold('-----b', { b: completion });
      googleBooksService.searchBooks = jest.fn(() => response);

      expect(
        effects.search$({
          debounce: 30,
          scheduler: getTestScheduler(),
        })
      ).toBeObservable(expected);
    });

    it('should return a book.SearchError if the books service throws', () => {
      const action = FindBookPageActions.searchBooks({ query: 'query' });
      const completion = BooksApiActions.searchFailure({
        errorMsg: 'Unexpected Error. Try again later.',
      });
      const error = { message: 'Unexpected Error. Try again later.' };

      actions$ = hot('-a---', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('-----b', { b: completion });
      googleBooksService.searchBooks = jest.fn(() => response);

      expect(
        effects.search$({
          debounce: 30,
          scheduler: getTestScheduler(),
        })
      ).toBeObservable(expected);
    });

    it(`should not do anything if the query is an empty string`, () => {
      const action = FindBookPageActions.searchBooks({ query: '' });

      actions$ = hot('-a---', { a: action });
      const expected = cold('---');

      expect(
        effects.search$({
          debounce: 30,
          scheduler: getTestScheduler(),
        })
      ).toBeObservable(expected);
    });
  });
});
