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

  username: string | null = null;
  isFilterActivated = signal<boolean>(false)

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
    // this.profile.getProfile('ews777')
    //   .subscribe({
    //     next: value => {
    //       console.log(value)
    //       this.username = value.username
    //     }
    //   })
  }

  onClickLogin(){
    this.router.navigate(['login'])
  }

  onClickProfile(){
    this.router.navigate([`profile`])
  }

  activateFilter(){
    this.isFilterActivated.set(!this.isFilterActivated())
  }

  findPerson(){
    this.filter.connectionId = this.signalRService.connectionId

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
