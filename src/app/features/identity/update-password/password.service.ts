import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  http = inject(HttpClient)
  baseApiUrl = `${environment.apiUrl}password`

  updatePassword(payload: { oldPassword: string | null, newPassword: string | null }) {
    return this.http.put(
      `${this.baseApiUrl}/change-password`, payload, {
        withCredentials: true
      });
  }
}
