import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BlockedUser } from './blocked-user';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockedUserService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}blockedPerson`

  getBlockedPersons(takePerson: number = 10, cursor?: string | Date | null) {
    let params = new HttpParams().set('takePerson', takePerson)

    if (cursor){
      const dateObj = new Date(cursor);
      params = params.set('cursor', dateObj.toISOString());
    }

    return this.http.get<BlockedUser[]>(`${this.url}`, {
      params,
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
