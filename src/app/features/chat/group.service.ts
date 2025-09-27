import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group} from './group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/Chat'

  createGroup(request: Group){
    return this.http.post<number>(`${this.url}/create`, request, {
      withCredentials: true
    })
  }

  getGroups(){
    return this.http.get<Group[]>(`${this.url}/get`,{
      withCredentials: true
    })
  }

  getGroup(idGroup: number){
    return this.http.get<Group>(`${this.url}/get-group?idGroup=${idGroup}`, {
      withCredentials: true
    })
  }

  updateGroup(group: Group){
    return this.http.put<Group>(`${this.url}/update`, group, {
      withCredentials: true
    })
  }

  deleteGroup(idGroup: number){
    return this.http.delete(`${this.url}/delete?idGroup=${idGroup}`,{
      withCredentials: true
    })
  }
}
