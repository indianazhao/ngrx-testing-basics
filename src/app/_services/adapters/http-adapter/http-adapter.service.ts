import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpAdapterService {
  constructor(private httpClient: HttpClient) {}

  patch<T>(url: string, body: any): Observable<T> {
    return this.httpClient.patch<T>(url, body);
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.httpClient.post<T>(url, body);
  }

  get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url);
  }
}
