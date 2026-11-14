import { NamedItem } from '../../../shared/location/location';

export interface Filter {
  theme: number | null,
  country: NamedItem | null,
  city: NamedItem | null,
  age: number | null,
  yourGender: number | null,
  partnerGender: number | null,
  language: NamedItem | null
}
