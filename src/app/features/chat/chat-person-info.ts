import { NamedItem } from '../../shared/location/location';

export interface ChatPersonInfo {
  idPerson: number | null
  idGroup: number | null
  isSingleChat: boolean | null
  idPartnerPerson: number | null
  isSentMessage: boolean | null
  partnerUsername: string | null
  search: ChatSearchInfo | null
}

export interface ChatSearchInfo {
  theme: number | null
  country: NamedItem | null
  city: NamedItem | null
  age: number | null
  language: NamedItem | null
}
