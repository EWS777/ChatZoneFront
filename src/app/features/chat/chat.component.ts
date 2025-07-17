import {Component, inject, OnInit, signal} from '@angular/core';
import {SignalRService} from './signalR.service';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {QuickMessageService} from '../profile/quick-messages/quick-message.service';
import {QuickMessage} from '../profile/quick-messages/quick-message';
import {Router} from '@angular/router';
import {FindPerson} from '../main/find-person';
import {MainService} from '../main/main.service';
import {BlockedUserService} from '../profile/blocked-users/blocked-user.service';

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
  private blockedPersonService = inject(BlockedUserService)

  groupName: string | null = null
  username: string | null = null;
  partnerUsername: string | null = null;
  messages: { user: string, message: string}[] = [];
  message: string=''
  quickMessageList: QuickMessage[] | null = null

  isSendQuickMessage = signal<boolean>(false)
  isOtherPersonLeft = signal<boolean>(false)
  isShowNewFinder = signal<boolean>(false)
  isDisconnect = signal<'exit' | 'skip' | null>(null)
  isActivateSettings = signal<boolean>(false)
  isPersonBlocked = signal<boolean>(false)

  filter: FindPerson = {
    connectionId: '',
    theme: null,
    country: null,
    city: null,
    age: null,
    yourGender: null,
    language: null,
    partnerGender: null,
    isSearchAgain: false
  }

  async ngOnInit(){
    await this.signalRService.ensureConnection();
    const {username, groupName, otherUsername} = await this.signalRService.getPersonGroupAndUsername()
    this.username = username
    this.groupName = groupName
    this.partnerUsername = otherUsername

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
    this.filter.isSearchAgain = true
    this.mainService.findPerson(this.filter).subscribe({
      next: (res: any) => {
        if (res.message === 'Chat was created!') window.location.reload()
      },
      error: err => {
        console.error('Error', err)
      }
    })
  }

  blockPerson(){
    this.blockedPersonService.createBlockedPerson(this.partnerUsername!).subscribe({
      next: () => {
        this.isPersonBlocked.set(true)
      },
      error: err => {
        console.error('Error', err)
      }
    })
  }
}
