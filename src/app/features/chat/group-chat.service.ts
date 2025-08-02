import { Injectable } from '@angular/core';
import {BaseChatService} from './abstract/base-chat.service';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService extends BaseChatService{
  private adminSubject = new Subject<{isAdmin: boolean}>();

  constructor() {
    super();

    this.hubConnection.on('AdminChanged', (isAdmin: boolean)=>{
      this.adminSubject.next({isAdmin: isAdmin})
    })
  }

  setNewAdmin(): Observable<{ isAdmin: boolean }>{
    return this.adminSubject.asObservable();
  }

  // async getPersonGroupAndUsername(): Promise<{idPerson: number | null; idGroup: number | null; isSingleChat: boolean; username: string | null}> {
  //   return await this.hubConnection.invoke('GetPersonGroupAndUsername');
  // }
}
