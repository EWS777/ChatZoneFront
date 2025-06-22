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

  updateFilter(filter: Filter){
    return this.http.put<Filter>(`${this.url}`, {filterRequest: filter},{
      withCredentials: true
    })
  }
}
