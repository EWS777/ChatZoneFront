import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlockedUser } from './blocked-user';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockedUserService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}blockedPerson`

  getBlockedPersons() {
    return this.http.get<BlockedUser[]>(`${this.url}`, {
      withCredentials: true
    })
  }

  createBlockedPerson(idPartnerPerson: number) {
    return this.http.post(`${this.url}/add/${idPartnerPerson}`, {}, {
      withCredentials: true
    })
  }

  deleteBlockedPerson(idBlockedPerson: number) {
    return this.http.delete(`${this.url}/delete/${idBlockedPerson}`, {
      withCredentials: true
    })
  }
}
