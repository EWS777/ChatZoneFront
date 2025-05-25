import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProfileInterface} from './profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/'

  getProfile(username: string | null){
    return this.http.get<ProfileInterface>(`${this.url}${username}`, {
      withCredentials: true
    })
  }
}
