import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResetPassword} from './resetPassword';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  http = inject(HttpClient)
  baseApiUrl = `${environment.apiUrl}password/`

  resetPassword(payload: ResetPassword){
    return this.http.put(`${this.baseApiUrl}set-password`, payload)
  }
}
