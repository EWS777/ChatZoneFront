import {AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {QuickMessageService} from '../../profile/quick-messages/quick-message.service';
import {QuickMessage} from '../../profile/quick-messages/quick-message';
import {Router} from '@angular/router';
import {FindPerson} from '../../main/find-person';
import {MainService} from '../../main/main.service';
import {BlockedUserService} from '../../profile/blocked-users/blocked-user.service';
import {SingleChatService} from '../single-chat.service';
import {BaseChatService} from '../abstract/base-chat.service';
import {Group} from '../group';
import {CountryList} from '../../profile/filter/enums/country-list';
import {CityList} from '../../profile/filter/enums/city-list';
import {AgeList} from '../../profile/filter/enums/age-list';
import {LangList} from '../../profile/filter/enums/lang-list';
import {GroupMemberService} from '../group-member/group-member.service';
import {GroupMember} from '../group-member/group-member';
import {GroupChatService} from '../group-chat.service';
import {MessageService} from '../messages/message.service';
import {GetMessageRequest} from '../messages/get-message-request';
import {firstValueFrom} from 'rxjs';
import {BlockedGroupMemberService} from '../blocked-group-member.service';
import {ChatPersonInfo} from '../chat-person-info';
import {ChatService} from '../chat.service';

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
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy{
  chatService = inject(ChatService)
  blockedGroupMemberService = inject(BlockedGroupMemberService)
  groupMemberService = inject(GroupMemberService)
  groupChatService = inject(GroupChatService)
  singleChatService = inject(SingleChatService)
  baseChatService = inject(BaseChatService)
  mainService = inject(MainService)
  private quickMessageService = inject(QuickMessageService)
  private blockedPersonService = inject(BlockedUserService)
  router = inject(Router)
  messageService = inject(MessageService)
  commonError: string = ''
  commonErrorUpdateChat: string = ''
  commonErrorBlockGroupMember: string = ''
  commonErrorSetNewAdmin: string = ''
  commonErrorDeleteGroupChat: string = ''
  commonErrorGetGroupMembers: string = ''
  titleError: string = ''

  messages: { idSender: number, message: string, createdAt: Date}[] = [];
  currentMessage: string=''
  quickMessageList: QuickMessage[] | null = null
  group: Group = {
    idGroup: null,
    title: '',
    country: null,
    city: null,
    age: null,
    lang: null,
    isAdmin: null,
    userCount: null
  }
  chatPersonInfo: ChatPersonInfo = {
    idPerson: null,
    idGroup: null,
    isSingleChat: null,
    idPartnerPerson: null,
    isSentMessage: null
  }
  groupMembers!: GroupMember[]

  isOtherPersonLeft = signal<boolean>(false)
  isShowNewFinder = signal<boolean>(false)
  isDisconnect = signal<'exit' | 'skip' | null>(null)
  isActivateSettings = signal<boolean>(false)
  isPersonBlocked = signal<boolean>(false)
  isGroupMember = signal<boolean>(false)
  isAdminStatusInfo = signal<boolean>(false)
  isDeleteGroupStatus = signal<boolean>(false)
  isNewAdminNotification = signal<boolean>(false)

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

    this.chatPersonInfo = await firstValueFrom(this.chatService.getChatPersonInfo())
    if (this.chatPersonInfo.idGroup === null) this.router.navigate([''])
    await this.loadPreviousMessages();
    this.scrollToBottom()

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

      requestAnimationFrame( () => {
        if (this.isUserAtBottom) {
          this.scrollToBottom();
        }
      })
    })

    if (this.chatPersonInfo.isSingleChat){
      this.singleChatService.personLeftChat(() => this.isOtherPersonLeft.set(true))
    }
    else {
      this.chatService.getGroup(this.chatPersonInfo.idGroup!).subscribe({
        next: value => {
          this.group = value
        },
        error: err => {
          console.log('Error', err)
        }
      })

      this.groupChatService.setNewAdmin().subscribe(isAdmin => {
        this.isGroupMember.set(false)
        this.group.isAdmin = isAdmin
        this.isNewAdminNotification.set(true)
      })

      this.groupChatService.notifyDeleteGroup().subscribe({
        next: () => {
          this.isDeleteGroupStatus.set(true)
        }
      })

      this.groupChatService.blockedGroupMember().subscribe({
        next: () =>{
          this.router.navigate(['/groups'], {
            state: {isGroupMemberBlocked: true}
          })
        }
      })

      this.groupChatService.updateGroupChat().subscribe({
        next: value => {
          this.group.title = value.title
          this.group.country = value.country
          this.group.city = value.city
          this.group.age = value.age
          this.group.lang = value.lang
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.singleChatService.offPersonLeftChat()
  }

  isLoadingHistory: boolean = false
  isAllMessagesLoaded: boolean = false
  skipMessage: number = 0

  isUserAtBottom = true;
  @ViewChild('chatContainer') private chatContainer!: ElementRef
  ngAfterViewInit(): void {
    this.scrollToBottom()
  }

  async onScroll(){
    const el = this.chatContainer.nativeElement;
    const scrollTop = el.scrollTop;

    if (scrollTop < 100 && !this.isLoadingHistory && !this.isAllMessagesLoaded) {
      await this.loadPreviousMessages();
    }

    const threshold = 150;
    const position = el.scrollTop + el.clientHeight;
    const height = el.scrollHeight;

    this.isUserAtBottom = (height - position) <= threshold;
  }

  private scrollToBottom(){
    const el = this.chatContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  private async loadPreviousMessages(){
    if (this.isLoadingHistory || this.isAllMessagesLoaded) return;

    this.isLoadingHistory = true

    const container = this.chatContainer.nativeElement
    const previousHeight = container.scrollHeight

    const messageRequest: GetMessageRequest = {
      IdPerson: this.chatPersonInfo.idPerson!,
      IdChat: this.chatPersonInfo.idGroup!,
      IsSingleChat: this.chatPersonInfo.isSingleChat!,
      SkipMessage: this.skipMessage
    }

    const messages = await firstValueFrom(this.messageService.getMessages(messageRequest))
    if (messages.message.length < 40) this.isAllMessagesLoaded = true

    this.skipMessage += messages.message.length

    this.messages = [...messages.message.reverse(), ...this.messages]

    setTimeout(() => {
      const newHeight = container.scrollHeight;
      container.scrollTop = newHeight - previousHeight;
      this.isLoadingHistory = false;
    });
  }

  async sendMessage(){
    this.commonError = ''

    try {
      await this.baseChatService.sendMessage(this.chatPersonInfo.idGroup!, this.currentMessage, this.chatPersonInfo.isSingleChat!)
      this.currentMessage = ''
      this.chatPersonInfo.isSentMessage = true
      requestAnimationFrame( () => {
        if (this.isUserAtBottom) {
          this.scrollToBottom();
        }
      })
    }
    catch (err: any){
      if (err.message) {
        const prefix = "HubException: "
        const index = err.message.indexOf(prefix)

        if (index !== -1) {
          this.commonError = err.message.substring(index + prefix.length)
        } else {
          this.commonError = err.message.replace('Error: ', '')
        }
      } else {
        this.commonError = 'Unhandled exception. To repair'
      }
    }
  }

  async sendQuickMessage(message: string){
    await this.baseChatService.sendMessage(this.chatPersonInfo.idGroup!, message, this.chatPersonInfo.isSingleChat!)
    this.chatPersonInfo.isSentMessage = true
  }

  async exitChat(isExit: boolean){
    if (this.chatPersonInfo.isSingleChat){
      this.chatService.finishSingleChat(this.chatPersonInfo.idGroup!).subscribe({
        next: () => {
          if (isExit) this.router.navigate([''])
          else {
            this.isDisconnect.set(null)
            this.isShowNewFinder.set(true)
            this.findNewPerson()
          }
        }
      })
    }
    else {
      if (!this.group.isAdmin){
        this.groupMemberService.deleteFromGroup(this.chatPersonInfo.idGroup!).subscribe({
          next: async () =>{
            await this.router.navigate(['/'])
          },
          error: err =>{
            console.log('Error', err)
          }
        })
      }

      else {
        this.isAdminStatusInfo.set(true)
      }
    }
  }

  deleteGroupChat(){
    this.chatService.deleteGroup(this.group.idGroup!).subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: err => {
        this.commonErrorDeleteGroupChat = err.error.title || 'Unhandled exception. To repair'
      }
    })
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
    this.blockedPersonService.createBlockedPerson(this.chatPersonInfo.idPartnerPerson!).subscribe({
      next: () => {
        this.isPersonBlocked.set(true)
        this.isActivateSettings.set(false)
      },
      error: err => {
        console.error('Error', err)
      }
    })
  }

  updateGroupData(){
    this.commonErrorUpdateChat = ''
    this.chatService.updateGroup(this.group).subscribe({
      next: value=>{
        const isAdmin = this.group.isAdmin

        this.group = value
        this.group.isAdmin = isAdmin
      },
      error: (err) => {
        if (err.status === 400 && err.error && err.error.errors) {
          if (err.error.errors['Title']) this.titleError = err.error.errors['Title'][0]
        } else {
          this.commonErrorUpdateChat = err.error.title || 'Unhandled exception. To repair'
        }
      }
    })
  }

  getGroupMembers(){
    this.groupMemberService.getUsers(this.chatPersonInfo.idGroup!).subscribe({
      next: value => {
        this.groupMembers = value
        this.isGroupMember.set(true)
      },
      error: err => {
        this.commonErrorGetGroupMembers = err.error.title || 'Unhandled exception. To repair'
      }
    })
  }

  setNewAdmin(idPerson: number){
    const payload = {
      IdNewAdminPerson: idPerson,
      IdGroup: this.chatPersonInfo.idGroup!
    };
    this.groupMemberService.setNewAdmin(payload).subscribe({
      next: () => {
        this.isActivateSettings.set(false)
        this.isAdminStatusInfo.set(false)
        this.isDisconnect.set(null)
      },
      error: err => {
        this.commonErrorSetNewAdmin = err.error.title || 'Unhandled exception. To repair'
      }
    })
  }

  blockFromGroupChat(idPerson: number){
    const payload = {
      IdBlockedPerson: idPerson,
      IdChat: this.chatPersonInfo.idGroup!
    };
    this.blockedGroupMemberService.blockGroupMember(payload).subscribe({
      next: () => {
        this.groupMembers = this.groupMembers.filter(member => member.idPerson !== idPerson)
      },
      error: err => {
        this.commonErrorBlockGroupMember = err.error.title || 'Unhandled exception. To repair'
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
