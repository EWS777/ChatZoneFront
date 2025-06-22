import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BlockedUser} from './blocked-user';

@Injectable({
  providedIn: 'root'
})
export class BlockedUserService {
  http = inject(HttpClient)
  url = 'https://localhost:7212'

  getBlockedPersons(username: string){
    return this.http.get<BlockedUser[]>(`${this.url}/${username}/blockPerson`,{
      withCredentials: true
    })
  }

  createBlockedPerson(username: string, idBlockedPerson: number){
    return this.http.post(`${this.url}/${username}/blockPerson/add/${idBlockedPerson}`,{},{
      withCredentials: true
    })
  }

  deleteBlockedPerson(username: string, idBlockedPerson: number){
    return this.http.delete(`${this.url}/${username}/blockPerson/delete/${idBlockedPerson}`,{
      withCredentials: true
    })
  }
}
