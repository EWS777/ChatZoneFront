import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City, Country, Language, SelectItem } from './location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}Location`

  private countries$?: Observable<Country[]>
  private languages$?: Observable<Language[]>

  getCountries(): Observable<Country[]> {
    this.countries$ ??= this.http.get<Country[]>(`${this.url}/countries`, { withCredentials: true })
      .pipe(shareReplay(1))
    return this.countries$
  }

  getLanguages(): Observable<Language[]> {
    this.languages$ ??= this.http.get<Language[]>(`${this.url}/languages`, { withCredentials: true })
      .pipe(shareReplay(1))
    return this.languages$
  }

  getCities(idCountry: number, search: string = '', take: number = 20): Observable<City[]> {
    let params = new HttpParams().set('take', take)
    if (search.trim()) params = params.set('search', search.trim())

    return this.http.get<City[]>(`${this.url}/countries/${idCountry}/cities`, { params, withCredentials: true })
  }

  countryItems(): Observable<SelectItem[]> {
    return this.getCountries().pipe(map(list => list.map(x => ({ value: x.idCountry, label: x.name }))))
  }

  languageItems(): Observable<SelectItem[]> {
    return this.getLanguages().pipe(map(list => list.map(x => ({ value: x.idLanguage, label: x.name }))))
  }
}
