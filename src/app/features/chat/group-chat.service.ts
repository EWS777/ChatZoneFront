import { Injectable } from '@angular/core';
import {BaseChatService} from './abstract/base-chat.service';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService extends BaseChatService{

  constructor() {
    super();
  }

  async addToGroup(groupName: number) {
    await this.hubConnection.invoke('AddToGroup', groupName)
  }
}
