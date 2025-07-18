import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group} from './group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/group/'

  createGroup(request: Group){
    return this.http.post(`${this.url}create`, request, {
      withCredentials: true
    })
  }

  getGroups(){
    return this.http.get<Group[]>(`${this.url}get`,{
      withCredentials: true
    })
  }
}
