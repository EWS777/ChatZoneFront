import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/search/'

  cancelFindPerson(){
    return this.http.delete(`${this.url}cancel`, {
      withCredentials: true
    })
  }
}
