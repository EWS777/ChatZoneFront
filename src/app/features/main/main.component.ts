import {Component, inject, OnInit, signal} from '@angular/core';
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
import {SignalRService} from '../chat/signalR.service';
import {FindPerson} from './find-person';
import {MainService} from './main.service';
import {FilterService} from '../profile/filter/filter.service';

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
  router = inject(Router)
  authService = inject(AuthorizationService)
  signalRService = inject(SignalRService)
  mainService = inject(MainService)
  profile = inject(ProfileService)
  filterService = inject(FilterService)

  username: string | null = null;
  isFindByProfile: boolean = false;
  isFilterActivated = signal<boolean>(false)
  isFindPerson = signal<boolean>(false)

  filter: FindPerson = {
    connectionId: '',
    themeList: null,
    country: null,
    city: null,
    age: null,
    gender: null,
    lang: null
  }

  countryList = Object.keys(CountryList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (CountryList as any)[name] as number }));

  ageList = Object.keys(AgeList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (AgeList as any)[name] as number }));

  cityList = Object.keys(CityList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (CityList as any)[name] as number }));

  langList = Object.keys(LangList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (LangList as any)[name] as number }));

  themeList = Object.keys(ThemeList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (ThemeList as any)[name] as number }));

  genderList = Object.keys(GenderList)
    .filter(k => isNaN(Number(k)))
    .map(name => ({ label: name, value: (GenderList as any)[name] as number }));


  ngOnInit(){
    this.profile.getProfile()
      .subscribe({
        next: value => {
          this.username = value.username
          this.isFindByProfile = value.isFindByProfile
        }
      })
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
          this.filter.themeList = value.themeList
          this.filter.city = value.city
          this.filter.gender = value.gender
          this.filter.lang = value.learnLang
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
    this.filter.connectionId = this.signalRService.connectionId
    this.isFindPerson.set(true)
    this.isFilterActivated.set(false)
    this.mainService.findPerson(this.filter).subscribe({
      next: () => { },
      error: err => {
        console.error('Error', err)
      }
    })
  }

  onClickLogout(){
    this.authService.logout().subscribe({
      next: () =>{
        this.router.navigate([''])
      },
      error: ()=>{
        this.authService.clearAuth()
        this.router.navigate([''])
      }
    })
  }
}
