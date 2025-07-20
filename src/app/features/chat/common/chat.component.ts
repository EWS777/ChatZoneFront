import {Component, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {QuickMessageService} from '../../profile/quick-messages/quick-message.service';
import {QuickMessage} from '../../profile/quick-messages/quick-message';
import {Router} from '@angular/router';
import {FindPerson} from '../../main/find-person';
import {MainService} from '../../main/main.service';
import {BlockedUserService} from '../../profile/blocked-users/blocked-user.service';
import {SingleChatService} from '../single-chat.service';
import {BaseChatService} from '../abstract/base-chat.service';

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
  singleChatService = inject(SingleChatService)
  baseChatService = inject(BaseChatService)
  mainService = inject(MainService)
  private quickMessageService = inject(QuickMessageService)
  private blockedPersonService = inject(BlockedUserService)
  router = inject(Router)

  groupName: string | null = null
  username: string | null = null;
  partnerUsername: string | null = null;
  messages: { user: string, message: string}[] = [];
  message: string=''
  quickMessageList: QuickMessage[] | null = null
  isSingleChat: boolean | null = null

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
    await this.baseChatService.startConnect()

    const {username, groupName, isSingleChat} = await this.baseChatService.getPersonGroupAndUsername()
    this.username = username
    this.groupName = groupName
    this.isSingleChat = isSingleChat

    this.quickMessageService.getQuickMessages().subscribe({
      next: value => {
        this.quickMessageList = value
      },
      error: err => {
        console.error('Error', err)
      }
    })

    this.baseChatService.receiveMessage().subscribe(data =>{
      this.messages.push(data)
    })

    if (this.isSingleChat){
      this.singleChatService.personLeftChat(() => this.isOtherPersonLeft.set(true))
    }
  }

  async sendMessage(){
    await this.baseChatService.sendMessage(this.groupName!, this.message)
    this.message = ''
  }

  async sendQuickMessage(message: string){
    await this.baseChatService.sendMessage(this.groupName!, message)
    this.isSendQuickMessage.set(true)
  }

  async exitChat(isExit: boolean){
    if (this.isSingleChat){
      await this.baseChatService.leaveChat(this.groupName!, true)
      if (isExit) await this.router.navigate([''])
      else {
        this.isShowNewFinder.set(true)
        this.findNewPerson()
      }
    }
    else {
      await this.baseChatService.leaveChat(this.groupName!, false)
      await this.router.navigate(['/'])
    }
  }

  changeIsDisconnectStatus(type: 'exit' | 'skip' | null) {
    this.isDisconnect.set(type)
  }

  findNewPerson(){
    this.filter.connectionId = this.baseChatService.connectionId
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
