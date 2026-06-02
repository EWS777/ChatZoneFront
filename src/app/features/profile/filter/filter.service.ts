import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Filter} from './filter';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/filter'

  getFilter(){
    return this.http.get<Filter>(`${this.url}`,{
      withCredentials: true
    })
  }
}
