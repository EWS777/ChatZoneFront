import { NamedItem } from '../../shared/location/location';

export interface Group {
  idGroup: number | null
  title: string
  country: NamedItem | null
  city: NamedItem | null
  age: number | null
  language: NamedItem | null
  isAdmin: boolean | null
  personCount: number | null
  createdAt: Date | string | null
}

export interface UpdateGroupRequest {
  idGroup: number
  title: string
  idCountry: number | null
  idCity: number | null
  age: number | null
  idLanguage: number | null
}
