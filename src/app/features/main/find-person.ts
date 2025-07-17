export interface FindPerson {
  connectionId: string
  theme: number | null,
  country: number | null,
  city: number | null,
  age: number | null,
  yourGender: number | null,
  partnerGender: number | null,
  language: number | null,
  isSearchAgain: boolean
}
