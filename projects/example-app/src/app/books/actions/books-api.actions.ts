import { createAction, props } from '@ngrx/store';

import { Book } from '@example-app/books/models';

export const searchSuccess = createAction(
  '[Books/API] Search Success',
  props<{ books: Book[]; total: number; page: number; perPage: number }>()
);

export const searchFailure = createAction(
  '[Books/API] Search Failure',
  props<{ errorMsg: string }>()
);
