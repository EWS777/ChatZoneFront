import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  http = inject(HttpClient)
  baseApiUrl = 'https://localhost:7212/'

  postLogin(payload: {usernameOrEmail: string, Password: string}){
    return this.http.post(`${this.baseApiUrl}login`, payload
      // {
      // withCredentials: true
    // }
    );
  }

  registerLogin(payload: {email: string, username: string, password: string}){
    return this.http.post(`${this.baseApiUrl}register`, payload)
  }
}
