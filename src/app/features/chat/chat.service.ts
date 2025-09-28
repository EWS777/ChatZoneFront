import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChatPersonInfo} from './chat-person-info';
import {Group} from './group';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/Chat'

  getActiveChat(){
    return this.http.get<{idChat: number | null, isSingleChat: boolean | null}>(`${this.url}/active-chat`,{
      withCredentials: true
    })
  }

  getChatPersonInfo(){
    return this.http.get<ChatPersonInfo>(`${this.url}`, {
      withCredentials: true
    })
  }

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
