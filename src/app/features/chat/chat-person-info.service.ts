import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ChatPersonInfo} from './chat-person-info';

@Injectable({
  providedIn: 'root'
})
export class ChatPersonInfoService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/ChatInfo'

  getChatPersonInfo(){
    return this.http.get<ChatPersonInfo>(`${this.url}`, {
      withCredentials: true
    })
  }
}
