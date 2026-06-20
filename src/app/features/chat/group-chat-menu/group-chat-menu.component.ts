import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Group} from '../group';
import {CountryList} from '../../profile/filter/enums/country-list';
import {CityList} from '../../profile/filter/enums/city-list';
import {AgeList} from '../../profile/filter/enums/age-list';
import {LangList} from '../../profile/filter/enums/lang-list';
import {GroupChatService} from '../group-chat.service';
import {Router, RouterLink} from '@angular/router';
import {GroupMemberService} from '../group-member/group-member.service';
import {ChatService, CreateGroupInterface} from '../chat.service';
import {CommonValidator} from '../../../shared/validation/CommonValidator';
import {DropdownSelectComponent} from '../../../shared/dropdown/dropdown-select.component';

interface CreateGroupForm {
  title: FormControl<string | null>;
  country: FormControl<number | null>;
  city: FormControl<number | null>;
  age: FormControl<number | null>;
  lang: FormControl<number | null>;
}

@Component({
  selector: 'app-chat-groupMenu-menu',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    DropdownSelectComponent
  ],
  standalone: true,
  templateUrl: './group-chat-menu.component.html',
  styleUrl: './group-chat-menu.component.css'
})

export class GroupChatMenuComponent implements OnInit{
  router = inject(Router)
  chatService = inject(ChatService)
  signalService = inject(GroupChatService)
  groupMemberService = inject(GroupMemberService)

  isGroupMemberBlocked = false;
  groupList: Group[] = []
  isCreateGroup = signal<boolean>(false)
  commonError: string = ''
  commonErrorAddToGroup: string = ''
  titleError: string = ''

  constructor() {
    const state = this.router.currentNavigation()?.extras.state
    this.isGroupMemberBlocked = state?.['isGroupMemberBlocked']
  }

  countryList = this.enumToKeyValue(CountryList);
  cityList = this.enumToKeyValue(CityList);
  ageList = this.enumToKeyValue(AgeList);
  langList = this.enumToKeyValue(LangList);

  protected readonly CountryList = CountryList;
  protected readonly CityList = CityList;
  protected readonly AgeList = AgeList;
  protected readonly LangList = LangList;

  private enumToKeyValue(enumObj: any) {
    return Object.keys(enumObj)
      .filter(k => isNaN(Number(k)))
      .map(name => ({ label: name, value: enumObj[name] }));
  }

  createGroupForm = new FormGroup<CreateGroupForm>({
    title: new FormControl<string | null>(null, [
      CommonValidator.required,
      CommonValidator.minLength(1),
      CommonValidator.maxLength(50),
    ]),
    country: new FormControl(null),
    city: new FormControl(null),
    age: new FormControl(null),
    lang: new FormControl(null)
  })


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

    const groupData: CreateGroupInterface = {
      title: this.createGroupForm.value.title!,
      country: this.createGroupForm.value.country ?? null,
      city: this.createGroupForm.value.city ?? null,
      age: this.createGroupForm.value.age ?? null,
      lang: this.createGroupForm.value.lang ?? null,
    }

    this.chatService.createGroup(groupData).subscribe({
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
