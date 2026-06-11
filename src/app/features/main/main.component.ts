import {Component, HostListener, inject, OnInit, signal} from '@angular/core';
import {ProfileService} from '../profile/profile.service';
import {Router} from '@angular/router';
import {AuthorizationService} from '../identity/authorization/authorization.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CountryList} from '../profile/filter/enums/country-list';
import {AgeList} from '../profile/filter/enums/age-list';
import {CityList} from '../profile/filter/enums/city-list';
import {LangList} from '../profile/filter/enums/lang-list';
import {ThemeList} from '../profile/filter/enums/theme-list';
import {GenderList} from '../profile/filter/enums/gender-list';
import {FindPerson} from './find-person';
import {MainService} from './main.service';
import {FilterService} from '../profile/filter/filter.service';
import {SingleChatService} from '../chat/single-chat.service';
import {environment} from '../../../environments/environment';
import {ChatService} from '../chat/chat.service';

@Component({
  selector: 'app-main',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  isStartFindPerson = signal<boolean>(false)

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler() {
    if (this.isStartFindPerson()){
      const url = `${environment.apiUrl}/Search/cancel`
      const data = JSON.stringify("")
      navigator.sendBeacon(url, data);
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
  isFindByProfile: boolean = false;
  isFilterActivated = signal<boolean>(false)
  isFindPerson = signal<boolean>(false)
  isAnyActiveChat = signal<boolean>(false)
  isMenuOpen = signal<boolean>(false)

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

  countryList = Object.keys(CountryList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({label: name, value: CountryList[name as keyof typeof CountryList]}))

  ageList = Object.keys(AgeList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: AgeList[name as keyof typeof AgeList]}))

  cityList = Object.keys(CityList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: CityList[name as keyof typeof CityList]}))

  langList = Object.keys(LangList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: LangList[name as keyof typeof LangList]}))

  themeList = Object.keys(ThemeList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: ThemeList[name as keyof typeof ThemeList]}))

  genderList = Object.keys(GenderList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: GenderList[name as keyof typeof GenderList]}))


  ngOnInit(){
    this.profile.getProfile()
      .subscribe({
        next: value => {
          this.username = value.username
          this.isFindByProfile = value.isFindByProfile
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
    if (this.isFindByProfile){
      this.filterService.getFilter().subscribe({
        next: value => {
          this.filter.country = value.country
          this.filter.age = value.age
          this.filter.theme = value.theme
          this.filter.city = value.city
          this.filter.yourGender = value.yourGender
          this.filter.partnerGender = value.partnerGender
          this.filter.language = value.language
        }
      })
    }
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

  findPerson(){
    this.chatService.getActiveChat().subscribe({
      next: value => {
        if(value.isSingleChat!==null){
          this.isAnyActiveChat.set(true)
        }
        else {
          this.startFindPerson()
        }
      }
    })
  }

  startFindPerson(){
    this.isFindPerson.set(true)
    this.isFilterActivated.set(false)

    this.signalService.startSearchSingleChat(this.filter)
      .then(() => {
        this.isStartFindPerson.set(true);
      })
      .catch(() => {
        this.isFindPerson.set(false);
      });
  }
}
