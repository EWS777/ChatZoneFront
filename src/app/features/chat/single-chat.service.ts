import { Injectable } from '@angular/core';
import {BaseChatService} from './abstract/base-chat.service';

export interface SingleChatFilter{
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
export class SingleChatService extends BaseChatService{

  constructor() {
    super();
  }

  personLeftChat(result: ()=>void){
    this.hubConnection.on('LeftChat', ()=>{
      this.ngZone.run(() => result())
    })
  }

  offPersonLeftChat(){
    this.hubConnection.off('LeftChat')
  }

  async startSearchSingleChat(filter: SingleChatFilter) : Promise<void>{
    await this.ensureConnection()
    return this.hubConnection.invoke('StartSearchSingleChat', filter);
  }

  onChatCreated(result: () => void) {
    this.hubConnection.on('ChatCreated', () => {
      this.ngZone.run(() => result())
    });
  }

  startSearch(result: () => void) {
    this.hubConnection.on('QueueJoined', () => {
      this.ngZone.run(() => result())
    });
  }
}
