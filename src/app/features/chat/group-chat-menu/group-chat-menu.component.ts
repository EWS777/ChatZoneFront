import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Group} from '../group';
import {CountryList} from '../../profile/filter/enums/country-list';
import {CityList} from '../../profile/filter/enums/city-list';
import {AgeList} from '../../profile/filter/enums/age-list';
import {LangList} from '../../profile/filter/enums/lang-list';
import {GroupChatService} from '../group-chat.service';
import {Router} from '@angular/router';
import {GroupMemberService} from '../group-member/group-member.service';
import {ChatService} from '../chat.service';
import {CommonValidator} from '../../../shared/validation/CommonValidator';

@Component({
  selector: 'app-chat-groupMenu-menu',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true,
  templateUrl: './group-chat-menu.component.html',
  styleUrl: './group-chat-menu.component.css'
})

export class GroupChatMenuComponent implements OnInit{
  router = inject(Router)
  isGroupMemberBlocked = false;

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state
    this.isGroupMemberBlocked = state?.['isGroupMemberBlocked']
  }

  chatService = inject(ChatService)
  signalService = inject(GroupChatService)
  groupMemberService = inject(GroupMemberService)

  protected readonly CountryList = CountryList;
  protected readonly CityList = CityList;
  protected readonly AgeList = AgeList;
  protected readonly LangList = LangList;
  groupList: Group[] = []
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
  isCreateGroup = signal<boolean>(false)
  isAnyActiveChat = signal<boolean>(false)
  commonError: string = ''
  commonErrorAddToGroup: string = ''
  titleError: string = ''
  createGroupForm = new FormGroup({
    title: new FormControl(null, [
      CommonValidator.required,
      CommonValidator.minLength(1),
      CommonValidator.maxLength(50),
    ])
  })

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


  ngOnInit(): void {
    this.chatService.getGroups().subscribe({
      next: value => {
        this.groupList = value
      }
    })
  }

  clearBlockState(){
    this.isGroupMemberBlocked = false
    window.history.replaceState({...window.history.state, isGroupMemberBlocked: false}, '')
  }

  async createGroup(){
    this.commonError = ''
    if (this.createGroupForm.invalid){
      this.createGroupForm.markAllAsTouched()
      return
    }
    this.group.title = this.createGroupForm.value.title!
      this.chatService.createGroup(this.group).subscribe({
        next: value =>{
          this.signalService.addToGroup(value)
        },
        error: (err) => {
          if(err.status === 400 && err.error && err.error.errors){
            if (err.error.errors['Title']) {
              this.titleError = err.error.errors['Title'][0];
            } else if (err.error.errors['title']) {
              this.titleError = err.error.errors['title'][0];
            }
          }
          else{
            this.commonError = err.error.title || 'Unhandled exception. To repair'
          }
        }
      })
  }

  async connectToGroup(idGroup: number){
    this.groupMemberService.addToGroup(idGroup).subscribe({
      next: async () =>{
        await this.signalService.addToGroup(idGroup)
      },
      error: err => {
        this.commonErrorAddToGroup = err.error.title || 'Unhandled exception. To repair'
      }
    })
  }
}
