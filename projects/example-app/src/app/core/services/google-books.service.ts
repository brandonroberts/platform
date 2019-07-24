import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Book } from '@example-app/books/models';

@Injectable({
  providedIn: 'root',
})
export class GoogleBooksService {
  private API_PATH = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  searchBooks(queryTitle: string, page = 0, perPage = 40) {
    const query = `orderBy=newest&q=${queryTitle}&maxResults=${perPage}&startIndex=${page}`;

    return this.http
      .get<{ totalItems: number; items: Book[] }>(`${this.API_PATH}?${query}`)
      .pipe(map(({ totalItems: total, items: books }) => ({ books, total })));
  }

  retrieveBook(volumeId: string): Observable<Book> {
    return this.http.get<Book>(`${this.API_PATH}/${volumeId}`);
  }
}
