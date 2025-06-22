import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  http = inject(HttpClient)
  baseApiUrl = 'https://localhost:7212/'

  resetPassword(payload: {email: string}){
    return this.http.post(`${this.baseApiUrl}reset-password?email=${encodeURIComponent(payload.email)}`, {});
  }

}
