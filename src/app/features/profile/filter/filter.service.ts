import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Filter } from './filter';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}filter`

  getFilter() {
    return this.http.get<Filter>(`${this.url}`, {
      withCredentials: true
    })
  }
}
