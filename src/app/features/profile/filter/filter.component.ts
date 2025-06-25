import {Component, inject, OnInit} from '@angular/core';
import {FilterService} from './filter.service';
import {Filter} from './filter';
import {CountryList} from './enums/country-list';
import {FormsModule} from '@angular/forms';
import {CityList} from './enums/city-list';
import {LangList} from './enums/lang-list';
import {ThemeList} from './enums/theme-list';
import {GenderList} from './enums/gender-list';
import {AgeList} from './enums/age-list';

@Component({
  selector: 'app-filter',
  imports: [
    FormsModule
  ],
  templateUrl: './filter.component.html',
  standalone: true,
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit{
  filterService = inject(FilterService)
  filter!: Filter

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
    this.filterService.getFilter()
      .subscribe({
        next: value => {
          this.filter = value
        }
      })
  }

  updateFilter(){
    this.filterService.updateFilter(this.filter).subscribe({
      next: value => {
        this.filter = value
      },
      error: err => {
        console.error('Update filter failed!', err)
      }
    })
  }
}
