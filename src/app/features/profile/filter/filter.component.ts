import {Component, inject, OnInit} from '@angular/core';
import {FilterService} from './filter.service';
import {Filter} from './filter';
import {CountryList} from './enums/country-list';
import {FormsModule} from '@angular/forms';
import {AgeList} from './enums/age-list';
import {CityList} from './enums/city-list';
import {LangList} from './enums/lang-list';
import {ThemeList} from './enums/theme-list';
import {GenderList} from './enums/gender-list';

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

  countryList = Object.values(CountryList).filter(x=>isNaN(+x))
  // ageList = Object.values(AgeList).filter(x=>isNaN(+x))
  cityList = Object.values(CityList).filter(x=>isNaN(+x))
  langList = Object.values(LangList).filter(x=>isNaN(+x))
  themeList = Object.values(ThemeList).filter(x=>isNaN(+x))
  genderList = Object.values(GenderList).filter(x=>isNaN(+x))


/*  ageList = Object.keys(AgeList)
    .filter(k => !isNaN(+k)) // получим ['0','1','2','3','4']
    .map(k => +k); // преобразуем в числа [0,1,2,3,4]*/



  ageList = AgeList;
  ageIndices = Object.keys(AgeList)
    .filter(k => !isNaN(+k))
    .map(k => +k);


  ngOnInit(){
    this.filterService.getFilter()
      .subscribe({
        next: value => {
          this.filter = value
        }
      })
  }

  updateFilter(){
    this.filterService.updateFilter(this.filter)
      .subscribe({
        next: value => {
          this.filter = value
        },
        error: err => {
          console.error('Update filter failed!', err)
        }
      })
  }

  protected readonly AgeList = AgeList;
}
