import {
  BooksApiActions,
  FindBookPageActions,
} from '@example-app/books/actions';
import { createReducer, on } from '@ngrx/store';

export const searchFeatureKey = 'search';

export interface State {
  ids: string[];
  total: number;
  page: number;
  perPage: number;
  loading: boolean;
  error: string;
  query: string;
}

export const initialState: State = {
  ids: [],
  total: 0,
  loading: false,
  page: 0,
  perPage: 40,
  error: '',
  query: '',
};

export const reducer = createReducer(
  initialState,
  on(FindBookPageActions.searchBooks, (state, { query, perPage = 40 }) => {
    return query === ''
      ? {
          ids: [],
          loading: false,
          error: '',
          total: 0,
          page: 0,
          perPage,
          query,
        }
      : {
          ...state,
          loading: true,
          error: '',
          query,
        };
  }),
  on(
    BooksApiActions.searchSuccess,
    (state, { books, total, page, perPage }) => ({
      ids: books.map(book => book.id),
      total,
      page,
      perPage,
      loading: false,
      error: '',
      query: state.query,
    })
  ),
  on(FindBookPageActions.searchPageChange, state => ({
    ...state,
    loading: true,
  })),
  on(BooksApiActions.searchFailure, (state, { errorMsg }) => ({
    ...state,
    loading: false,
    error: errorMsg,
  }))
);

export const getIds = (state: State) => state.ids;

export const getQuery = (state: State) => state.query;

export const getLoading = (state: State) => state.loading;

export const getError = (state: State) => state.error;

export const getTotal = (state: State) => state.total;

export const getPage = (state: State) => state.page;

export const getPerPage = (state: State) => state.perPage;
