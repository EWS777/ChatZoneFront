import { Component, DestroyRef, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Router } from '@angular/router';
import { AuthorizationService } from '../identity/authorization/authorization.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgeList } from '../profile/filter/enums/age-list';
import { ThemeList } from '../profile/filter/enums/theme-list';
import { GenderList } from '../profile/filter/enums/gender-list';
import { MainService } from './main.service';
import { FilterService } from '../profile/filter/filter.service';
import { SingleChatFilter, SingleChatService } from '../chat/single-chat.service';
import { environment } from '../../../environments/environment';
import { ChatService } from '../chat/chat.service';
import { DropdownSelectComponent } from '../../shared/dropdown/dropdown-select.component';
import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocationService } from '../../shared/location/location.service';
import { CityOptions } from '../../shared/location/city-options';

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
export class MainComponent implements OnInit, OnDestroy {
  isStartFindPerson = signal<boolean>(false)
  router = inject(Router)
  authService = inject(AuthorizationService)
  signalService = inject(SingleChatService)
  mainService = inject(MainService)
  profile = inject(ProfileService)
  filterService = inject(FilterService)
  chatService = inject(ChatService)
  locationService = inject(LocationService)
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
  countryList = toSignal(this.locationService.countryItems(), { initialValue: [] });
  cityOptions = new CityOptions(this.locationService, this.findSingleChatForm.controls.country, this.findSingleChatForm.controls.city, inject(DestroyRef));
  ageList = this.enumToKeyValue(AgeList);
  langList = toSignal(this.locationService.languageItems(), { initialValue: [] });
  genderList = this.enumToKeyValue(GenderList);
  private tokenExtractor = inject(HttpXsrfTokenExtractor)

  get maleAndFemaleOnly() {
    return this.genderList.filter(g => g.label === 'male' || g.label === 'female');
  }

  @HostListener('window:beforeunload')
  unloadHandler() {
    if (this.isStartFindPerson()) {
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

  ngOnInit() {
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

    this.signalService.startSearch(() => {
      this.isFindPerson.set(true)
    })
  }

  ngOnDestroy(): void {
    this.signalService.offChatCreated()
    this.signalService.offStartSearch()
  }

  onClickLogin() {
    this.router.navigate(['login']).then()
  }

  onClickProfile() {
    this.router.navigate([`profile`]).then()
  }

  activateFilter() {
    this.isFilterActivated.set(!this.isFilterActivated())
    this.filterService.getFilter().subscribe({
      next: value => {
        this.cityOptions.setValue(value.country, value.city)
        this.findSingleChatForm.get('age')?.setValue(value.age)
        this.findSingleChatForm.get('theme')?.setValue(value.theme)
        this.findSingleChatForm.get('yourGender')?.setValue(value.yourGender)
        this.findSingleChatForm.get('partnerGender')?.setValue(value.partnerGender)
        this.findSingleChatForm.get('language')?.setValue(value.language?.id ?? null)
      }
    })
  }

  cancelFindPerson() {
    this.mainService.cancelFindPerson().subscribe({
      next: () => {
        this.isFindPerson.set(false)
        this.isFilterActivated.set(true)
      },
      error: () => {}
    })
  }

  findPerson(isFindRandom: boolean) {
    this.chatService.getActiveChat().subscribe({
      next: value => {
        if (value.isSingleChat !== null) {
          this.isAnyActiveChat.set(true)
        } else {
          this.findSingleChatForm.get('isFindRandomPerson')?.setValue(isFindRandom)
          this.startFindPerson()
        }
      }
    })
  }

  startFindPerson() {
    this.isFilterActivated.set(false)

    const form = this.findSingleChatForm.getRawValue()
    const isRandom = form.isFindRandomPerson === true
    const filterData: SingleChatFilter = {
      connectionId: form.connectionId ?? null,
      theme: isRandom ? null : form.theme ?? null,
      idCountry: isRandom ? null : form.country ?? null,
      idCity: isRandom ? null : form.city ?? null,
      age: isRandom ? null : form.age ?? null,
      yourGender: isRandom ? null : form.yourGender ?? null,
      idLanguage: isRandom ? null : form.language ?? null,
      partnerGender: isRandom ? null : form.partnerGender ?? null,
      isSearchAgain: !!form.isSearchAgain,
      isFindRandomPerson: isRandom
    }

    this.signalService.startSearchSingleChat(filterData)
      .then(() => {
        this.isStartFindPerson.set(true);
      })
      .catch(() => {
        this.isFindPerson.set(false);
      });
  }

  private enumToKeyValue(enumObj: any) {
    return Object.keys(enumObj)
      .filter(k => isNaN(Number(k)))
      .map(name => ({ label: name, value: enumObj[name] }))
      .filter(item => item.value !== 0);
  }
}
