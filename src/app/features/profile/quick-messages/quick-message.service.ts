import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {QuickMessage} from './quick-message';

@Injectable({
  providedIn: 'root'
})
export class QuickMessageService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/QuickMessage'

  getQuickMessages(){
    return this.http.get<QuickMessage[]>(`${this.url}`, {
      withCredentials: true
    })
  }

  createQuickMessage(quickMessage: QuickMessage){
    return this.http.post<QuickMessage>(`${this.url}/add`, quickMessage, {
      withCredentials: true
    })
  }

  updateQuickMessage(quickMessage: QuickMessage){
    return this.http.put<QuickMessage>(`${this.url}/${quickMessage.idQuickMessage}/update`, quickMessage, {
      withCredentials: true
    })
  }

  deleteQuickMessage(quickMessageId: number){
    return this.http.delete(`${this.url}/delete/${quickMessageId}`, {
      withCredentials: true
    })
  }
}
