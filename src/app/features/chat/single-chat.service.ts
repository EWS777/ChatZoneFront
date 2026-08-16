import { Injectable } from '@angular/core';
import { BaseChatService } from './abstract/base-chat.service';

export interface SingleChatFilter {
  connectionId: string | null,
  theme: number | null,
  country: number | null,
  city: number | null,
  age: number | null,
  yourGender: number | null,
  language: number | null,
  partnerGender: number | null,
  isSearchAgain: boolean,
  isFindRandomPerson: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SingleChatService extends BaseChatService {
  private personLeftChatHandler: (() => void) | null = null;
  private chatCreatedHandler: (() => void) | null = null;
  private queueJoinedHandler: (() => void) | null = null;

  constructor() {
    super();
  }

  personLeftChat(result: () => void) {
    this.offPersonLeftChat();
    this.personLeftChatHandler = () => this.ngZone.run(() => result());
    this.hubConnection.on('LeftChat', this.personLeftChatHandler)
  }

  offPersonLeftChat() {
    if (this.personLeftChatHandler) {
      this.hubConnection.off('LeftChat', this.personLeftChatHandler)
      this.personLeftChatHandler = null;
    }
  }

  async startSearchSingleChat(filter: SingleChatFilter): Promise<void> {
    await this.ensureConnection()
    return this.hubConnection.invoke('StartSearchSingleChat', filter);
  }

  onChatCreated(result: () => void) {
    this.offChatCreated();
    this.chatCreatedHandler = () => this.ngZone.run(() => result());
    this.hubConnection.on('ChatCreated', this.chatCreatedHandler);
  }

  offChatCreated() {
    if (this.chatCreatedHandler) {
      this.hubConnection.off('ChatCreated', this.chatCreatedHandler);
      this.chatCreatedHandler = null;
    }
  }

  startSearch(result: () => void) {
    this.offStartSearch();
    this.queueJoinedHandler = () => this.ngZone.run(() => result());
    this.hubConnection.on('QueueJoined', this.queueJoinedHandler);
  }

  offStartSearch() {
    if (this.queueJoinedHandler) {
      this.hubConnection.off('QueueJoined', this.queueJoinedHandler);
      this.queueJoinedHandler = null;
    }
  }
}
