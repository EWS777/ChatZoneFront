import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}search/`

  cancelFindPerson(){
    return this.http.delete(`${this.url}cancel`, {
      withCredentials: true
    })
  }
}
