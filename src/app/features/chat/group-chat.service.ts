import { Injectable } from '@angular/core';
import {BaseChatService} from './abstract/base-chat.service';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService extends BaseChatService{
  private adminSubject = new Subject<boolean>();
  private blockedMember = new Subject();
  private deleteGroup = new Subject();

  constructor() {
    super();

    this.hubConnection.on('AdminChanged', (isAdmin: boolean)=>{
      this.adminSubject.next(isAdmin)
    })

    this.hubConnection.on('BlockedIntoGroupChat', ()=>{
      this.blockedMember.next(()=>{})
    })

    this.hubConnection.on('NotifyDeleteGroup', ()=>{
      this.deleteGroup.next(()=>{})
    })
  }
  async addToGroup(groupName: number) {
    await this.hubConnection.invoke('AddToGroup', groupName)
  }

  setNewAdmin(): Observable<boolean>{
    return this.adminSubject.asObservable();
  }

  blockedGroupMember(){
    return this.blockedMember.asObservable();
  }

  notifyDeleteGroup(){
    return this.deleteGroup.asObservable();
  }
}
