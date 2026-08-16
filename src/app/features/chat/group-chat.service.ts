import { Injectable } from '@angular/core';
import { BaseChatService } from './abstract/base-chat.service';
import { Observable, Subject } from 'rxjs';
import { Group } from './group';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService extends BaseChatService {
  private adminSubject = new Subject<void>();
  private blockedMember = new Subject<void>();
  private deleteGroup = new Subject<void>();
  private updateGroupChatParam = new Subject<Group>();

  constructor() {
    super();

    this.hubConnection.on('AdminChanged', () => {
      this.ngZone.run(() => this.adminSubject.next())
    });

    this.hubConnection.on('BlockedIntoGroupChat', () => {
      this.ngZone.run(() => this.blockedMember.next())
    })

    this.hubConnection.on('NotifyDeleteGroup', () => {
      this.ngZone.run(() => this.deleteGroup.next())
    })

    this.hubConnection.on('UpdateGroupChatParam', (result: Group) => {
      this.ngZone.run(() => this.updateGroupChatParam.next(result))
    })
  }

  async addToGroup(groupName: number) {
    await this.ensureConnection()
    await this.hubConnection.invoke('AddToGroup', groupName)
  }

  setNewAdmin(): Observable<void> {
    return this.adminSubject.asObservable();
  }

  blockedGroupMember() {
    return this.blockedMember.asObservable();
  }

  notifyDeleteGroup() {
    return this.deleteGroup.asObservable();
  }

  updateGroupChat(): Observable<Group> {
    return this.updateGroupChatParam.asObservable();
  }
}
