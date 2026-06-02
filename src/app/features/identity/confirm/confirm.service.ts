import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}registration`

  confirm(link: string){
    return this.http.post(`${this.url}/confirm?token=${link}`, null,{
      withCredentials: true
      })
  }

  reconfirm(email: string){
    return this.http.post(`${this.url}/reconfirm?email=${email}`, {})
  }
}
