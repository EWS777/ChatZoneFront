import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from './profile';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}profile`

  getProfile() {
    return this.http.get<Profile>(`${this.url}`, {
      withCredentials: true
    })
  }

  updateProfile(oldUsername: string, profile: Profile) {
    return this.http.put<Profile>(`${this.url}/${oldUsername}`, profile, {
      withCredentials: true
    })
  }
}

