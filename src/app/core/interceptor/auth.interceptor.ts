import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthorizationService} from '../../features/identity/authorization/authorization.service';
import {BehaviorSubject, catchError, filter, switchMap, take, throwError} from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) =>{
  const authService = inject(AuthorizationService)

  const isAuthUrl = req.url.includes('authentication/refresh') || req.url.includes('authentication/logout');

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401 && !isAuthUrl){

        if (isRefreshing){
          return refreshTokenSubject.pipe(
            filter(result => result !== null),
            take(1),
            switchMap(() => next(req))
          )
        }

        isRefreshing = true
        refreshTokenSubject.next(null)

        return authService.refreshToken().pipe(
          switchMap(() => {
            isRefreshing = false;
            refreshTokenSubject.next(true);
            return next(req);
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            refreshTokenSubject.next(false);
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(()=> err)
    })
  );
}
