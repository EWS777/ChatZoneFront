import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface DeleteProfileResponse {
  message: string;
}

export interface DeleteProfileRequest {
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class DeleteProfileService {
  http = inject(HttpClient)
  baseApiUrl = `${environment.apiUrl}profile/`

  deleteProfileService(payload: DeleteProfileRequest): Observable<DeleteProfileResponse> {
    return this.http.post<DeleteProfileResponse>(`${this.baseApiUrl}delete`, payload, {
      withCredentials: true
    })
  }
}
