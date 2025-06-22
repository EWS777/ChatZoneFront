import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Filter} from './filter';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/filter'

  getFilter(username: string){
    return this.http.get<Filter>(`${this.url}/${username}`,{
      withCredentials: true
    })
  }

  updateFilter(username: string, filter: Filter){
    return this.http.put<Filter>(`${this.url}/${username}`, filter,{
      withCredentials: true
    })
  }
}
