import { Injectable } from '@angular/core';
import {BaseChatService} from './abstract/base-chat.service';

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

  startSearchSingleChat(filter: any){
    return this.hubConnection.invoke('StartSearchSingeChat', filter);
  }

  onChatCreated(result: () => void) {
    this.hubConnection.on('ChatCreated', () => {
      result();
    });
  }
}
