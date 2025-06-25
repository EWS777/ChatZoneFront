import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  http = inject(HttpClient)
  baseApiUrl = 'https://localhost:7212/password'

  updatePassword(payload: { oldPassword: string, newPassword: string }) {
    return this.http.put(
      `${this.baseApiUrl}/change-password`, payload, {
        withCredentials: true
      });
  }
}
