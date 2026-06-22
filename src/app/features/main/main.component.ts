import {Component, HostListener, inject, OnInit, signal} from '@angular/core';
import {ProfileService} from '../profile/profile.service';
import {Router} from '@angular/router';
import {AuthorizationService} from '../identity/authorization/authorization.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CountryList} from '../profile/filter/enums/country-list';
import {AgeList} from '../profile/filter/enums/age-list';
import {CityList} from '../profile/filter/enums/city-list';
import {LangList} from '../profile/filter/enums/lang-list';
import {ThemeList} from '../profile/filter/enums/theme-list';
import {GenderList} from '../profile/filter/enums/gender-list';
import {MainService} from './main.service';
import {FilterService} from '../profile/filter/filter.service';
import {SingleChatFilter, SingleChatService} from '../chat/single-chat.service';
import {environment} from '../../../environments/environment';
import {ChatService} from '../chat/chat.service';
import {DropdownSelectComponent} from '../../shared/dropdown/dropdown-select.component';
import {HttpXsrfTokenExtractor} from '@angular/common/http';

@Component({
  selector: 'app-main',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DropdownSelectComponent
  ],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  isStartFindPerson = signal<boolean>(false)
  private tokenExtractor = inject(HttpXsrfTokenExtractor)

  @HostListener('window:beforeunload')
  unloadHandler() {
    if (this.isStartFindPerson()){
      const url = `${environment.apiUrl}Search/cancel`
      const xsrfToken = this.tokenExtractor.getToken()

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
      }

      fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({}),
        keepalive: true,
        credentials: "include"
      });
    }
  }

  router = inject(Router)
  authService = inject(AuthorizationService)
  signalService = inject(SingleChatService)
  mainService = inject(MainService)
  profile = inject(ProfileService)
  filterService = inject(FilterService)
  chatService = inject(ChatService)

  username: string | null = null;
  isFilterActivated = signal<boolean>(false)
  isFindPerson = signal<boolean>(false)
  isAnyActiveChat = signal<boolean>(false)
  isMenuOpen = signal<boolean>(false)

  findSingleChatForm = new FormGroup({
    connectionId: new FormControl<string | null>(null),
    theme: new FormControl<number | null>(null),
    country: new FormControl<number | null>(null),
    city: new FormControl<number | null>(null),
    age: new FormControl<number | null>(null),
    yourGender: new FormControl<number | null>(null),
    language: new FormControl<number | null>(null),
    partnerGender: new FormControl<number | null>(null),
    isSearchAgain: new FormControl<boolean>(false),
    isFindRandomPerson: new FormControl<boolean>(false)
  })

  themeList = this.enumToKeyValue(ThemeList);
  countryList = this.enumToKeyValue(CountryList);
  cityList = this.enumToKeyValue(CityList);
  ageList = this.enumToKeyValue(AgeList);
  langList = this.enumToKeyValue(LangList);
  genderList = this.enumToKeyValue(GenderList);

  get maleAndFemaleOnly() {
    return this.genderList.filter(g => g.label === 'male' || g.label === 'female');
  }

  private enumToKeyValue(enumObj: any) {
    return Object.keys(enumObj)
      .filter(k => isNaN(Number(k)))
      .map(name => ({ label: name, value: enumObj[name] }))
      .filter(item => item.value !== 0);
  }

  ngOnInit(){
    this.profile.getProfile()
      .subscribe({
        next: value => {
          this.username = value.username
        }
      })

    this.signalService.onChatCreated(() => {
      this.isStartFindPerson.set(false);
      this.isAnyActiveChat.set(true);
    });
  }

  onClickLogin(){
    this.router.navigate(['login'])
  }

  onClickProfile(){
    this.router.navigate([`profile`])
  }

  activateFilter(){
    this.isFilterActivated.set(!this.isFilterActivated())
    this.filterService.getFilter().subscribe({
      next: value => {
        this.findSingleChatForm.get('country')?.setValue(value.country)
        this.findSingleChatForm.get('age')?.setValue(value.age)
        this.findSingleChatForm.get('theme')?.setValue(value.theme)
        this.findSingleChatForm.get('city')?.setValue(value.city)
        this.findSingleChatForm.get('yourGender')?.setValue(value.yourGender)
        this.findSingleChatForm.get('partnerGender')?.setValue(value.partnerGender)
        this.findSingleChatForm.get('language')?.setValue(value.language)
      }
    })
  }

  cancelFindPerson(){
    this.mainService.cancelFindPerson().subscribe({
      next: () => {
        this.isFindPerson.set(false)
        this.isFilterActivated.set(true)
      },
      error: err => {
        console.error('Error', err)
      }
    })
  }

  findPerson(isFindRandom: boolean){
    this.chatService.getActiveChat().subscribe({
      next: value => {
        if(value.isSingleChat!==null){
          this.isAnyActiveChat.set(true)
        }
        else {
          this.findSingleChatForm.get('isFindRandomPerson')?.setValue(isFindRandom)
          this.startFindPerson()
        }
      }
    })
  }

  startFindPerson(){
    this.isFindPerson.set(true)
    this.isFilterActivated.set(false)

    const filterData: SingleChatFilter = {
      connectionId: this.findSingleChatForm.value.connectionId ?? null,
      theme: this.findSingleChatForm.value.isFindRandomPerson === true ? null : this.findSingleChatForm.value.theme ?? null,
      country: this.findSingleChatForm.value.isFindRandomPerson === true ? null :  this.findSingleChatForm.value.country ?? null,
      city: this.findSingleChatForm.value.isFindRandomPerson === true ? null :  this.findSingleChatForm.value.city ?? null,
      age: this.findSingleChatForm.value.isFindRandomPerson === true ? null :  this.findSingleChatForm.value.age ?? null,
      yourGender: this.findSingleChatForm.value.isFindRandomPerson === true ? null :  this.findSingleChatForm.value.yourGender ?? null,
      language: this.findSingleChatForm.value.isFindRandomPerson === true ? null :  this.findSingleChatForm.value.language ?? null,
      partnerGender: this.findSingleChatForm.value.isFindRandomPerson === true ? null :  this.findSingleChatForm.value.partnerGender ?? null,
      isSearchAgain: !!this.findSingleChatForm.value.isSearchAgain,
      isFindRandomPerson: !!this.findSingleChatForm.value.isFindRandomPerson
    }

    this.signalService.startSearchSingleChat(filterData)
      .then(() => {
        this.isStartFindPerson.set(true);
      })
      .catch(() => {
        this.isFindPerson.set(false);
      });
  }
}
