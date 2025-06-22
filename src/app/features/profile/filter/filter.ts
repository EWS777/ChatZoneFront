import {ThemeList} from './enums/theme-list';
import {CountryList} from './enums/country-list';
import {CityList} from './enums/city-list';
import {AgeList} from './enums/age-list';
import {LangList} from './enums/lang-list';

export interface Filter {
  themeList: ThemeList | null,
  country: CountryList | null,
  city: CityList | null,
  age: AgeList | null,
  gender: 'male' | 'female' | null,
  nativeLang: LangList | null,
  learnLang: LangList | null
}
