import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlockedGroupMemberService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/BlockedGroupMember'

  blockGroupMember(payload: {IdBlockedPerson: number; IdChat: number}){
    return this.http.post(`${this.url}/add`, payload, {
      withCredentials: true
    })
  }
}
