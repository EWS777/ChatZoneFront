import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface ReconfirmResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}registration`

  confirm(link: string) {
    return this.http.post(`${this.url}/confirm?token=${link}`, null, {
      withCredentials: true
    })
  }

  reconfirm(email: string): Observable<ReconfirmResponse> {
    return this.http.post<ReconfirmResponse>(`${this.url}/reconfirm?email=${email}`, {})
  }
}
