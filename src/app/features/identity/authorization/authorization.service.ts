import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, map, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  http = inject(HttpClient)
  baseApiUrl = 'https://localhost:7212/'

  private authState = new BehaviorSubject<boolean>(false)

  checkAuth(){
    return this.http.get<{username: string}>(`${this.baseApiUrl}authentication/me`, {
      withCredentials: true
    }).pipe(
      map(() =>{
        this.authState.next(true)
        return true
      }),
      catchError(() => {
        this.authState.next(false)
        return of(false)
      })
    )
  }

  isAuthenticated()
  {
    return this.authState.asObservable();
  }

  clearAuth(){
    this.authState.next(false)
  }

  postLogin(payload: {usernameOrEmail: string, Password: string}){
    return this.http.post(`${this.baseApiUrl}authentication/login`, payload,{
      withCredentials: true
    }).pipe(tap(() => this.authState.next(true)))
  }

  registerLogin(payload: {email: string, username: string, password: string}){
    return this.http.post(`${this.baseApiUrl}registration/register`, payload,{
      withCredentials: true
    })
  }

  refreshToken(){
    return this.http.post(`${this.baseApiUrl}authentication/refresh`,{},
      {withCredentials:true}).pipe(
        tap(() => this.authState.next(true)),
        map(() => true),
        catchError(() => {
          this.authState.next(false)
          return of(false)
        })
    )
  }

  logout() {
    return this.http.post(`${this.baseApiUrl}authentication/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.authState.next(false)),
        map(() => true),
        catchError(() => {
          this.authState.next(false);
          return of(false);
        })
      );
  }
}
