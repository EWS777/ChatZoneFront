import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DeleteProfileService {
  http = inject(HttpClient)
  baseApiUrl = 'https://localhost:7212/profile/'

  deleteProfileService(payload: any){

    return this.http.post(`${this.baseApiUrl}delete`, payload, {
      withCredentials: true
    })
  }
}
