import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Profile} from './profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/profile'

  getProfile(){
    return this.http.get<Profile>(`${this.url}`, {
      withCredentials: true
    })
  }
}

