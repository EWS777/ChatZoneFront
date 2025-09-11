import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GroupMember} from './group-member';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/groupMember'

  getUsers(idGroup: number){
    return this.http.get<GroupMember[]>(`${this.url}/get-list?idGroup=${idGroup}`,{
      withCredentials: true
    })
  }

  setNewAdmin(payload: {IdNewAdminPerson: number, IdGroup: number}){
    return this.http.put(`${this.url}/change-admin`, payload, {
      withCredentials: true
    })
  }

  addToGroup(idGroup: number){
    return this.http.post(`${this.url}/add?idGroup=${idGroup}`, {},{
      withCredentials: true
    })
  }

  deleteFromGroup(idChat: number){
    return this.http.delete(`${this.url}/leave?idChat=${idChat}`,{
      withCredentials: true
    })
  }
}
