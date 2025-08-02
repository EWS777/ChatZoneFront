import { Injectable } from '@angular/core';
import {BaseChatService} from './abstract/base-chat.service';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService extends BaseChatService{
  private adminSubject = new Subject<boolean>();

  constructor() {
    super();

    this.hubConnection.on('AdminChanged', (isAdmin: boolean)=>{
      this.adminSubject.next(isAdmin)
    })
  }
  async addToGroup(groupName: number) {
    await this.hubConnection.invoke('AddToGroup', groupName)
  }

  setNewAdmin(): Observable<boolean>{
    return this.adminSubject.asObservable();
  }
}
