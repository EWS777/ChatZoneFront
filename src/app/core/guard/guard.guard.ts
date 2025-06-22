import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthorizationService} from '../../features/identity/authorization/authorization.service';
import {of, switchMap, take, tap} from 'rxjs';

export const guardGuard: CanActivateFn = () => {

  const authService = inject(AuthorizationService)
  const router = inject(Router)

  return authService.isAuthenticated().pipe(
    take(1),
    switchMap(isAuth => {
      if (isAuth) return of(true);

      return authService.checkAuth().pipe(
        tap(auth => {
          if (!auth) router.navigate(['/login']);
        })
      );
    })
  );
};
