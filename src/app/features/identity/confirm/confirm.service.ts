import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/registration/confirm'

  confirm(link: string){
    return this.http.post(`${this.url}?token=${link}`, null
    )
  }
}
