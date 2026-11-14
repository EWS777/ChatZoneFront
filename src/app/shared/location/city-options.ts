import { DestroyRef, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { LocationService } from './location.service';
import { NamedItem, SelectItem } from './location';

export class CityOptions {
  readonly items = signal<SelectItem[]>([])
  private readonly search$ = new Subject<string>()

  constructor(
    private readonly locationService: LocationService,
    private readonly countryControl: FormControl<number | null>,
    private readonly cityControl: FormControl<number | null>,
    destroyRef: DestroyRef
  ) {
    if (countryControl.value === null) cityControl.disable({ emitEvent: false })

    countryControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(destroyRef))
      .subscribe(idCountry => {
        cityControl.setValue(null)
        this.items.set([])

        if (idCountry === null) {
          cityControl.disable()
        } else {
          cityControl.enable()
          this.search('')
        }
      })

    this.search$
      .pipe(
        debounceTime(300),
        switchMap(term => {
          const idCountry = countryControl.value
          if (idCountry === null) return of([])
          return locationService.getCities(idCountry, term).pipe(catchError(() => of([])))
        }),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(cities => this.items.set(cities.map(x => ({ value: x.idCity, label: x.name }))))
  }

  search(term: string) {
    this.search$.next(term)
  }

  setValue(country: NamedItem | null, city: NamedItem | null) {
    this.countryControl.setValue(country?.id ?? null)

    if (city && country) {
      if (!this.items().some(x => x.value === city.id)) this.items.update(list => [{ value: city.id, label: city.name }, ...list])
      this.cityControl.setValue(city.id)
    }
  }
}
