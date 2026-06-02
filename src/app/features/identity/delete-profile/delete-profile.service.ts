import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DeleteProfileService {
  http = inject(HttpClient)
  baseApiUrl = `${environment.apiUrl}profile/`

  deleteProfileService(payload: any){

    return this.http.post(`${this.baseApiUrl}delete`, payload, {
      withCredentials: true
    })
  }
}
