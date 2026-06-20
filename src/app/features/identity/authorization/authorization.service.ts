import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, map, of, switchMap, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  http = inject(HttpClient)
  router = inject(Router)
  baseApiUrl = environment.apiUrl

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

  get isAuthenticatedValue(): boolean {
    return this.authState.value;
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
    }).pipe(
      switchMap(() =>{
        return this.http.get(`${this.baseApiUrl}authentication/csrf`, {
          withCredentials: true
        })
      }),
      tap(() => this.authState.next(true))
    )
  }

  registerLogin(payload: {email: string, username: string, password: string}){
    return this.http.post(`${this.baseApiUrl}registration/register`, payload,{
      withCredentials: true
    })
  }

  refreshToken(){
    return this.http.post(`${this.baseApiUrl}authentication/refresh`,{}, {withCredentials:true}).pipe(
        tap(() => this.authState.next(true)),
        map(() => true),
        catchError((err) => {
          this.authState.next(false)
          this.logoutUser()
          return throwError(() => err);
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

  logoutUser() {
    this.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
