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
      result()
    })
  }

  offPersonLeftChat(){
    this.hubConnection.off('LeftChat')
  }

  startSearchSingleChat(filter: SingleChatFilter) : Promise<void>{
    return this.hubConnection.invoke('StartSearchSingleChat', filter);
  }

  onChatCreated(result: () => void) {
    this.hubConnection.on('ChatCreated', () => {
      result();
    });
  }
}
