import {Component, inject, OnInit, signal} from '@angular/core';
import {SignalRService} from './signalR.service';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {QuickMessageService} from '../profile/quick-messages/quick-message.service';
import {QuickMessage} from '../profile/quick-messages/quick-message';
import {Router} from '@angular/router';
import {FindPerson} from '../main/find-person';
import {MainService} from '../main/main.service';

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
  mainService = inject(MainService)
  router = inject(Router)
  private signalRService = inject(SignalRService)
  private quickMessageService = inject(QuickMessageService)

  groupName: string | null = null
  username: string | null = null;
  messages: { user: string, message: string }[] = [];
  message: string=''
  quickMessageList: QuickMessage[] | null = null
  isSendQuickMessage = signal<boolean>(false)
  isOtherPersonLeft = signal<boolean>(false)
  isShowNewFinder = signal<boolean>(false)
  isDisconnect = signal<'exit' | 'skip' | null>(null)

  filter: FindPerson = {
    connectionId: '',
    themeList: null,
    country: null,
    city: null,
    age: null,
    gender: null,
    lang: null
  }

  async ngOnInit(){
    await this.signalRService.ensureConnection();
    const {username, groupName} = await this.signalRService.getPersonGroupAndUsername()
    this.username = username
    this.groupName = groupName

    this.quickMessageService.getQuickMessages().subscribe({
      next: value => {
        this.quickMessageList = value
      },
      error: err => {
        console.error('Error', err)
      }
    })

    if (this.groupName!==null){
      this.signalRService.receiveMessage().subscribe(data =>{
        this.messages.push(data)
      })
    }

    this.signalRService.personLeftChat(() => this.isOtherPersonLeft.set(true))
  }

  async sendMessage(){
    await this.signalRService.sendMessage(this.groupName!, this.message)
    this.message = ''
  }

  async sendQuickMessage(message: string){
    await this.signalRService.sendMessage(this.groupName!, message)
    this.isSendQuickMessage.set(true)
  }

  async exitChat(isExit: boolean){
    await this.signalRService.leaveChat(this.groupName!)
    if (isExit) await this.router.navigate([''])
    else {
      this.isShowNewFinder.set(true)
      this.findNewPerson()
    }
  }

  changeIsDisconnectStatus(type: 'exit' | 'skip' | null) {
    this.isDisconnect.set(type)
  }

  findNewPerson(){
    this.filter.connectionId = this.signalRService.connectionId

    this.mainService.findPerson(this.filter).subscribe({
      next: (res: any) => {
        if (res.message === 'Chat was created!') window.location.reload()
      },
      error: err => {
        console.error('Error', err)
      }
    })
  }
}
