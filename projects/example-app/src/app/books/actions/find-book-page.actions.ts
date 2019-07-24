import { createAction, props } from '@ngrx/store';

export const searchBooks = createAction(
  '[Find Book Page] Search Books',
  props<{ query: string; perPage?: number }>()
);

export const searchPageChange = createAction(
  '[Find Book Page] Change Page',
  props<{ page: number; perPage: number }>()
);
