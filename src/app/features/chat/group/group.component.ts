import {Component, inject, OnInit, signal} from '@angular/core';
import {GroupService} from './group.service';
import {Group} from './group';
import {CountryList} from '../../profile/filter/enums/country-list';
import {CityList} from '../../profile/filter/enums/city-list';
import {AgeList} from '../../profile/filter/enums/age-list';
import {LangList} from '../../profile/filter/enums/lang-list';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-group',
  imports: [
    FormsModule
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit{
  groupService = inject(GroupService)

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
    lang: null
  }

  isCreateGroup = signal<boolean>(false)

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
    this.groupService.getGroups().subscribe({
      next: value => {
        this.groupList = value
      }
    })
  }

  createGroup(){
    this.groupService.createGroup(this.group).subscribe({
      next: () =>{
        //connection to SignalR
      },
      error: err => {
        console.error('Error', err)
      }
    })
  }
}
