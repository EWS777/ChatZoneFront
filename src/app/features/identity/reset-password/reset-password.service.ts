import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  http = inject(HttpClient)
  baseApiUrl = `${environment.apiUrl}password/`

  resetPassword(email: string | null){
    return this.http.post(`${this.baseApiUrl}reset-password?email=${email}`, null)
  }
}
