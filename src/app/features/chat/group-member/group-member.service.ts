import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GroupMember} from './group-member';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/groupMember'

  getUsers(groupName: string){
    return this.http.get<GroupMember[]>(`${this.url}/get-list?groupName=${groupName}`,{
      withCredentials: true
    })
  }
}
