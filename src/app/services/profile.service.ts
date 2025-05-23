import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProfileFromVideo} from '../interfaces/profileFromVideo.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient)

  baseApiUrl = 'https://icherniakov.ru/yt-course/'


  constructor() { }

  getTestAccounts(){
    return this.http.get<ProfileFromVideo[]>(`${this.baseApiUrl}account/test_accounts`)
  }
}
