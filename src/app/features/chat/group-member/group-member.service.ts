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

  getUsers(idGroup: number, takePerson: number = 10, cursor?: string | Date | null, cursorId?: number | null) {
    let params = new HttpParams()
      .set('idGroup', idGroup)
      .set('takePerson', takePerson)

    if (cursor){
      params = params.set('cursor', typeof cursor === 'string' ? cursor : cursor.toISOString());
      if (cursorId != null) params = params.set('cursorId', cursorId)
    }

    return this.http.get<GroupMember[]>(`${this.url}/get-list`, {
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
