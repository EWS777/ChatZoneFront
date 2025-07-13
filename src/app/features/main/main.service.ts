import {inject, Injectable} from '@angular/core';
import {FindPerson} from './find-person';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/search/'

  findPerson(request: FindPerson){
    return this.http.post(`${this.url}search`, request,{
      withCredentials: true
    })
  }

  cancelFindPerson(){
    return this.http.delete(`${this.url}cancel`, {
      withCredentials: true
    })
  }
}
