import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResetPassword} from './resetPassword';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  http = inject(HttpClient)
  baseApiUrl = 'https://localhost:7212/password/'

  resetPassword(payload: ResetPassword){
    return this.http.put(`${this.baseApiUrl}set-password`, payload)
  }
}
