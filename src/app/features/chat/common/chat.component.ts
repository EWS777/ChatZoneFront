import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { QuickMessageService } from '../../profile/quick-messages/quick-message.service';
import { QuickMessage } from '../../profile/quick-messages/quick-message';
import { Router } from '@angular/router';
import { FindPerson } from '../../main/find-person';
import { BlockedUserService } from '../../profile/blocked-users/blocked-user.service';
import { SingleChatService } from '../single-chat.service';
import { BaseChatService } from '../abstract/base-chat.service';
import { Group } from '../group';
import { CountryList } from '../../profile/filter/enums/country-list';
import { CityList } from '../../profile/filter/enums/city-list';
import { AgeList } from '../../profile/filter/enums/age-list';
import { LangList } from '../../profile/filter/enums/lang-list';
import { GroupMemberService } from '../group-member/group-member.service';
import { GroupMember } from '../group-member/group-member';
import { GroupChatService } from '../group-chat.service';
import { MessageService } from '../messages/message.service';
import { GetMessageRequest } from '../messages/get-message-request';
import { firstValueFrom } from 'rxjs';
import { BlockedGroupMemberService } from '../blocked-group-member.service';
import { ChatPersonInfo } from '../chat-person-info';
import { ChatService } from '../chat.service';
import { CommonValidator } from '../../../shared/validation/CommonValidator';
import { MainService } from '../../main/main.service';
import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DropdownSelectComponent } from '../../../shared/dropdown/dropdown-select.component';

interface HubError {
  message?: string;
}

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    DatePipe,
    DropdownSelectComponent
  ],
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  chatService = inject(ChatService)
  blockedGroupMemberService = inject(BlockedGroupMemberService)
  groupMemberService = inject(GroupMemberService)
  groupChatService = inject(GroupChatService)
  singleChatService = inject(SingleChatService)
  baseChatService = inject(BaseChatService)
  mainService = inject(MainService)
  router = inject(Router)
  messageService = inject(MessageService)
  commonError: string = ''
  commonErrorUpdateChat: string = ''
  commonErrorBlockGroupMember: string = ''
  commonErrorSetNewAdmin: string = ''
  commonErrorDeleteGroupChat: string = ''
  commonErrorGetGroupMembers: string = ''
  titleError: string = ''
  messages: { idSender: number, message: string, createdAt: Date }[] = [];
  currentMessageControl = new FormControl(null, [
    CommonValidator.required,
    CommonValidator.minLength(1),
    CommonValidator.maxLength(1024),
  ])
  updateGroupForm = new FormGroup({
    title: new FormControl('', [
      CommonValidator.required,
      CommonValidator.minLength(1),
      CommonValidator.maxLength(50),
    ]),
    country: new FormControl<number | null>(null),
    city: new FormControl<number | null>(null),
    age: new FormControl<number | null>(null),
    lang: new FormControl<number | null>(null),
    idGroup: new FormControl<number | null>(null),
    isAdmin: new FormControl<boolean | null>(null),
    personCount: new FormControl<number | null>(null)
  })
  quickMessageList: QuickMessage[] | null = null
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
  isShowQuickMessages = signal<boolean>(false)
  filter: FindPerson = {
    connectionId: '',
    theme: null,
    country: null,
    city: null,
    age: null,
    yourGender: null,
    language: null,
    partnerGender: null,
    isSearchAgain: true,
    isFindRandomPerson: false
  }
  isLoadingHistory: boolean = false
  isAllMessagesLoaded: boolean = false
  skipMessage: number = 0
  isUserAtBottom = true;
  countryList = this.enumToKeyValue(CountryList);
  cityList = this.enumToKeyValue(CityList);
  ageList = this.enumToKeyValue(AgeList);
  langList = this.enumToKeyValue(LangList);
  private quickMessageService = inject(QuickMessageService)
  private blockedPersonService = inject(BlockedUserService)
  private tokenExtractor = inject(HttpXsrfTokenExtractor)
  @ViewChild('chatContainer') private chatContainer!: ElementRef

  @HostListener('window:beforeunload')
  unloadHandler() {
    if (this.isShowNewFinder()) {
      const url = `${environment.apiUrl}Search/cancel`
      const xsrfToken = this.tokenExtractor.getToken()

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
      }

      void fetch(url, { method: 'POST', headers: headers, body: JSON.stringify({}), keepalive: true, credentials: "include" });
    }
  }

  async ngOnInit() {
    this.baseChatService.receiveMessage().subscribe(data => {
      this.messages.push(data)

      requestAnimationFrame(() => {
        if (this.isUserAtBottom) {
          this.scrollToBottom();
        }
      })
    })

    await this.baseChatService.startConnect()

    this.chatPersonInfo = await firstValueFrom(this.chatService.getChatPersonInfo())
    if (this.chatPersonInfo.idGroup === null) await this.router.navigate([''])
    await this.loadPreviousMessages();
    this.scrollToBottom()

    this.quickMessageService.getQuickMessages().subscribe({
      next: value => {
        this.quickMessageList = value
      },
      error: () => {}
    })

    if (this.chatPersonInfo.isSingleChat) {
      this.singleChatService.personLeftChat(() => this.isOtherPersonLeft.set(true))
    } else {
      this.chatService.getGroup(this.chatPersonInfo.idGroup!).subscribe({
        next: value => {
          this.updateGroupForm.patchValue({
            title: value.title,
            country: value.country,
            city: value.city,
            age: value.age,
            lang: value.lang,
            isAdmin: value.isAdmin
          });
        },
        error: () => {}
      })

      this.groupChatService.setNewAdmin().subscribe(isAdmin => {
        this.isGroupMember.set(false)
        this.updateGroupForm.controls.isAdmin.setValue(isAdmin)
        this.isNewAdminNotification.set(true)
      })

      this.groupChatService.notifyDeleteGroup().subscribe({
        next: () => {
          this.isDeleteGroupStatus.set(true)
        }
      })

      this.groupChatService.blockedGroupMember().subscribe({
        next: () => {
          this.router.navigate(['/groups'], {
            state: { isGroupMemberBlocked: true }
          })
        }
      })

      this.groupChatService.updateGroupChat().subscribe({
        next: value => {
          this.updateGroupForm.patchValue({
            title: value.title,
            country: value.country,
            city: value.city,
            age: value.age,
            lang: value.lang
          });
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.singleChatService.offPersonLeftChat()
  }

  ngAfterViewInit(): void {
    this.scrollToBottom()
  }

  async onScroll() {
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

  async sendMessage() {
    this.commonError = ''
    if (this.currentMessageControl.invalid) {
      this.currentMessageControl.markAsTouched();
      return;
    }
    const message = (this.currentMessageControl.value || '').trim()

    const idGroup = this.chatPersonInfo.idGroup;
    const isSingleChat = this.chatPersonInfo.isSingleChat;

    if (idGroup === null || idGroup === undefined || isSingleChat === null || isSingleChat === undefined) {
      this.commonError = 'Chat data is incomplete. Cannot send message.';
      return;
    }

    try {
      await this.baseChatService.sendMessage(idGroup, message, isSingleChat)
      this.currentMessageControl.reset()
      this.chatPersonInfo.isSentMessage = true
      requestAnimationFrame(() => {
        if (this.isUserAtBottom) {
          this.scrollToBottom();
        }
      })
    } catch (err: unknown) {
      const hubError = err as HubError
      if (hubError && typeof hubError.message == 'string') {
        const prefix = "HubException: "
        const index = hubError.message.indexOf(prefix)

        if (index !== -1) {
          this.commonError = hubError.message.substring(index + prefix.length)
        } else {
          this.commonError = hubError.message.replace('Error: ', '')
        }
      } else {
        this.commonError = 'Unhandled exception. To repair'
      }
    }
  }

  async sendQuickMessage(message: string) {
    await this.baseChatService.sendMessage(this.chatPersonInfo.idGroup!, message, this.chatPersonInfo.isSingleChat!)
    this.chatPersonInfo.isSentMessage = true
  }

  async exitChat(isExit: boolean) {
    if (this.chatPersonInfo.isSingleChat) {
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
    } else {
      if (!this.updateGroupForm.controls.isAdmin.value) {
        this.groupMemberService.deleteFromGroup(this.chatPersonInfo.idGroup!).subscribe({
          next: async () => {
            this.router.navigate(['/']).then()
          },
          error: () => {}
        })
      } else {
        this.isAdminStatusInfo.set(true)
      }
    }
  }

  deleteGroupChat() {
    this.chatService.deleteGroup(this.updateGroupForm.controls.idGroup.value!).subscribe({
      next: () => {
        this.router.navigate(['/']).then()
      },
      error: err => {
        this.commonErrorDeleteGroupChat = err.error.title || 'Unhandled exception. To repair'
      }
    })
  }

  changeIsDisconnectStatus(type: 'exit' | 'skip' | null) {
    this.isDisconnect.set(type)
  }

  findNewPerson() {
    this.filter.connectionId = this.baseChatService.connectionId
    this.filter.isSearchAgain = true

    this.singleChatService.startSearchSingleChat(this.filter)
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
      });
  }

  blockPerson() {
    this.blockedPersonService.createBlockedPerson(this.chatPersonInfo.idPartnerPerson!).subscribe({
      next: () => {
        this.isPersonBlocked.set(true)
        this.isActivateSettings.set(false)
      },
      error: () => {}
    })
  }

  updateGroupData() {
    this.commonErrorUpdateChat = ''
    if (this.updateGroupForm.invalid) {
      this.updateGroupForm.markAllAsTouched()
      return
    }
    this.updateGroupForm.controls.title.setValue(this.updateGroupForm.value.title!)
    const rawValue = this.updateGroupForm.getRawValue()
    const payload: Group = {
      title: rawValue.title!,
      country: rawValue.country ? +rawValue.country : null,
      city: rawValue.city ? +rawValue.city : null,
      age: rawValue.age ? +rawValue.age : null,
      lang: rawValue.lang ? +rawValue.lang : null,
      idGroup: rawValue.idGroup ? +rawValue.idGroup : 0,
      isAdmin: rawValue.isAdmin,
      personCount: rawValue.personCount ? +rawValue.personCount : null
    };

    this.chatService.updateGroup(payload).subscribe({
      next: value => {
        this.updateGroupForm.controls.title.setValue(value.title)
        this.updateGroupForm.controls.country.setValue(value.country)
        this.updateGroupForm.controls.city.setValue(value.city)
        this.updateGroupForm.controls.age.setValue(value.age)
        this.updateGroupForm.controls.lang.setValue(value.lang)
        this.updateGroupForm.controls.isAdmin.setValue(value.isAdmin)
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

  getGroupMembers() {
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

  setNewAdmin(idPerson: number) {
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

  blockFromGroupChat(idPerson: number) {
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

  isMessageGrouped(currentIndex: number): boolean {
    if (currentIndex === 0) return false;

    const currentMsg = this.messages[currentIndex];
    const prevMsg = this.messages[currentIndex - 1];

    if (currentMsg.idSender !== prevMsg.idSender) {
      return false;
    }

    const currentDate = new Date(currentMsg.createdAt);
    const prevDate = new Date(prevMsg.createdAt);

    const isSameHour = currentDate.getHours() === prevDate.getHours();
    const isSameMinute = currentDate.getMinutes() === prevDate.getMinutes();

    return isSameHour && isSameMinute;
  }

  cancelFindPerson() {
    this.mainService.cancelFindPerson().subscribe({
      next: () => {
        this.router.navigate(['/']).then()
      },
      error: () => {}
    })
  }

  private scrollToBottom() {
    const el = this.chatContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  private async loadPreviousMessages() {
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

  private enumToKeyValue(enumObj: any) {
    return Object.keys(enumObj)
      .filter(k => isNaN(Number(k)))
      .map(name => ({ label: name, value: enumObj[name] }))
      .filter(item => item.value !== 0);
  }
}
