import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GetMessageRequest} from './get-message-request';
import {Message} from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/Message'

  getMessages(payload: GetMessageRequest){
    return this.http.post<Message>(`${this.url}/get`, payload, {
      withCredentials: true
    })
  }
}
