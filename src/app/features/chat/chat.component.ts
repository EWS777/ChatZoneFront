import {Component, inject, OnInit} from '@angular/core';
import {SignalRService} from './signalR.service';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
  signalRService = inject(SignalRService)

  groupName: string | null = null
  username: string | null = null;
  messages: { user: string, message: string }[] = [];
  message: string=''

  async ngOnInit(){
    await this.signalRService.ensureConnection();
    const {username, groupName} = await this.signalRService.getPersonGroupAndUsername()
    this.username = username
    this.groupName = groupName

    if (this.groupName!==null){
      await this.connectSignalR()
    }
  }

  async connectSignalR(){
    this.signalRService.receiveMessage().subscribe(data =>{
      this.messages.push(data)
    })
  }

  async sendMessage(){
    await this.signalRService.sendMessage(this.groupName!, this.message)
    this.message = ''
  }
}
