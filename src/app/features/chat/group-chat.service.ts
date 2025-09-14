import { Injectable } from '@angular/core';
import {BaseChatService} from './abstract/base-chat.service';
import {Observable, Subject} from 'rxjs';
import {Group} from './group';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService extends BaseChatService{
  private adminSubject = new Subject<boolean>();
  private blockedMember = new Subject();
  private deleteGroup = new Subject();
  private updateGroupChatParam = new Subject<Group>();

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

    this.hubConnection.on('UpdateGroupChatParam', (result: Group) =>{
      this.updateGroupChatParam.next(result)
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

  updateGroupChat(): Observable<Group>{
    return this.updateGroupChatParam.asObservable();
  }
}
