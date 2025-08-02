import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group} from './group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/'

  createGroup(request: Group){
    return this.http.post<number>(`${this.url}group/create`, request, {
      withCredentials: true
    })
  }

  getGroups(){
    return this.http.get<Group[]>(`${this.url}group/get`,{
      withCredentials: true
    })
  }

  addToGroup(idGroup: number){
    return this.http.post(`${this.url}groupMember/add?idGroup=${idGroup}`, {},{
      withCredentials: true
    })
  }

  deleteFromGroup(){
    return this.http.delete(`${this.url}groupMember/leave`,{
      withCredentials: true
    })
  }

  getGroup(idGroup: number){
    return this.http.get<Group>(`${this.url}group/get-group?idGroup=${idGroup}`, {
      withCredentials: true
    })
  }

  updateGroup(group: Group){
    return this.http.put<Group>(`${this.url}group/update`, group, {
      withCredentials: true
    })
  }

  blockGroupMember(payload: {IdBlockedPerson: number; IdChat: number}){
    return this.http.post(`${this.url}BlockedGroupMember/block`, payload, {
      withCredentials: true
    })
  }
}
