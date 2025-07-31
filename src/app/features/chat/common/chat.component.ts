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
import {GroupService} from '../group.service';
import {Group} from '../group';
import {CountryList} from '../../profile/filter/enums/country-list';
import {CityList} from '../../profile/filter/enums/city-list';
import {AgeList} from '../../profile/filter/enums/age-list';
import {LangList} from '../../profile/filter/enums/lang-list';
import {GroupMemberService} from '../group-member/group-member.service';
import {GroupMember} from '../group-member/group-member';

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
  groupMemberService = inject(GroupMemberService)
  singleChatService = inject(SingleChatService)
  baseChatService = inject(BaseChatService)
  mainService = inject(MainService)
  private quickMessageService = inject(QuickMessageService)
  private blockedPersonService = inject(BlockedUserService)
  router = inject(Router)
  groupService = inject(GroupService)

  groupName: string | null = null
  username: string | null = null;
  partnerUsername: string | null = null;
  messages: { user: string, message: string}[] = [];
  message: string=''
  quickMessageList: QuickMessage[] | null = null
  isSingleChat: boolean | null = null
  group: Group = {
    idGroup: null,
    title: '',
    country: null,
    city: null,
    age: null,
    lang: null,
    isAdmin: null,
    groupName: null
  }
  groupEditable: Group = { ...this.group }
  groupMembers!: GroupMember[]

  isSendQuickMessage = signal<boolean>(false)
  isOtherPersonLeft = signal<boolean>(false)
  isShowNewFinder = signal<boolean>(false)
  isDisconnect = signal<'exit' | 'skip' | null>(null)
  isActivateSettings = signal<boolean>(false)
  isPersonBlocked = signal<boolean>(false)
  isGroupMember = signal<boolean>(false)

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
    else {
      this.groupService.getGroup(this.groupName!).subscribe({
        next: value => {
          this.group = value
          this.groupEditable = { ...value }
        },
        error: err => {
          console.log('Error', err)
        }
      })
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
        this.isDisconnect.set(null)
        this.isShowNewFinder.set(true)
        this.findNewPerson()
      }
    }
    else {
      this.groupService.deleteFromGroup().subscribe({
        next: async () =>{
          await this.baseChatService.leaveChat(this.groupName!, false)
          await this.router.navigate(['/'])
        },
        error: err =>{
          console.log('Error', err)
        }
      })
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

  updateGroupData(){
    this.groupService.updateGroup(this.groupEditable).subscribe({
      next: value=>{
        this.group = value
        this.groupEditable = { ...value }
      },
      error: err => {
        console.log('Error', err)
      }
    })
  }

  getGroupMembers(){
    this.groupMemberService.getUsers(this.groupName!).subscribe({
      next: value => {
        this.groupMembers = value
        this.isGroupMember.set(true)
      },
      error: err => {
        console.log('Error', err)
      }
    })
  }

  protected readonly CountryList = CountryList;
  protected readonly CityList = CityList;
  protected readonly AgeList = AgeList;
  protected readonly LangList = LangList;

  countryList = Object.keys(CountryList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (CountryList as any)[name] as number }));

  cityList = Object.keys(CityList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (CityList as any)[name] as number }));

  ageList = Object.keys(AgeList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (AgeList as any)[name] as number }));

  langList = Object.keys(LangList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (LangList as any)[name] as number }));
}
