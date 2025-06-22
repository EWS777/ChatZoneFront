import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QuickMessage} from './quick-message';

@Injectable({
  providedIn: 'root'
})
export class QuickMessageService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/QuickMessage'

  getQuickMessages(username: string){
    return this.http.get<QuickMessage[]>(`${this.url}/${username}`, {
      withCredentials: true
    })
  }

  createQuickMessage(username: string, quickMessage: QuickMessage){
    return this.http.post<QuickMessage>(`${this.url}/${username}/add`, quickMessage, {
      withCredentials: true
    })
  }

  updateQuickMessage(username: string, quickMessage: QuickMessage){
    return this.http.put<QuickMessage>(`${this.url}/${username}/${quickMessage.idQuickMessage}/update`, quickMessage, {
      withCredentials: true
    })
  }

  deleteQuickMessage(username: string, quickMessage: QuickMessage){
    return this.http.delete(`${this.url}/${username}/delete/${quickMessage.idQuickMessage}`, {
      withCredentials: true
    })
  }
}
