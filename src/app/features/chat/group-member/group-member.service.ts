import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GroupMember } from './group-member';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberService {
  http = inject(HttpClient)
  url = `${environment.apiUrl}groupMember`

  getUsers(idGroup: number, takePerson: number = 10, cursor?: string | Date | null) {
    let params = new HttpParams().set('takePerson', takePerson)

    params = params.set('idGroup', idGroup)

    if (cursor){
      const dateObj = new Date(cursor);
      params = params.set('cursor', dateObj.toISOString());
    }

    return this.http.get<GroupMember[]>(`${this.url}/get-list?idGroup=${idGroup}`, {
      params,
      withCredentials: true
    })
  }

  setNewAdmin(payload: { IdNewAdminPerson: number, IdGroup: number }) {
    return this.http.put(`${this.url}/change-admin`, payload, {
      withCredentials: true
    })
  }

  addToGroup(idGroup: number) {
    return this.http.post(`${this.url}/add?idGroup=${idGroup}`, {}, {
      withCredentials: true
    })
  }

  deleteFromGroup(idChat: number) {
    return this.http.delete(`${this.url}/leave?idChat=${idChat}`, {
      withCredentials: true
    })
  }
}
