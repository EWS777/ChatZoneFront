import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockedGroupMemberService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}BlockedGroupMember`

  blockGroupMember(payload: {IdBlockedPerson: number; IdChat: number}){
    return this.http.post(`${this.url}/add`, payload, {
      withCredentials: true
    })
  }
}
