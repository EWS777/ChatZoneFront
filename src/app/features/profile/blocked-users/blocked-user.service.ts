import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BlockedUser} from './blocked-user';

@Injectable({
  providedIn: 'root'
})
export class BlockedUserService {
  http = inject(HttpClient)
  url = 'https://localhost:7212/blockPerson'

  getBlockedPersons(){
    return this.http.get<BlockedUser[]>(`${this.url}`,{
      withCredentials: true
    })
  }

  createBlockedPerson(idBlockedPerson: number){
    return this.http.post(`${this.url}/add/${idBlockedPerson}`,{},{
      withCredentials: true
    })
  }

  deleteBlockedPerson(idBlockedPerson: number){
    return this.http.delete(`${this.url}/delete/${idBlockedPerson}`,{
      withCredentials: true
    })
  }
}
