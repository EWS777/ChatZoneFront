import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthorizationService} from '../../features/identity/authorization/authorization.service';
import {catchError, switchMap, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) =>{
  const authService = inject(AuthorizationService)

  const isRefreshUrl = req.url.endsWith('/refresh');

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401 && !isRefreshUrl){
        return authService.refreshToken().pipe(
          switchMap(() => next(req)),
          catchError(() =>{
            return throwError(() => err)
          })
        )
      }
      return throwError(()=> err)
    })
  );
}
