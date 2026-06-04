import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { guardGuard } from './guard.guard';
import { AuthorizationService } from '../../features/identity/authorization/authorization.service';

import { Observable, of, lastValueFrom } from 'rxjs';

describe('guardGuard', () =>{
  let mockAuthService: jasmine.SpyObj<AuthorizationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthorizationService', ['isAuthenticated', 'checkAuth'])
    mockRouter = jasmine.createSpyObj('Router', ['navigate'])

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthorizationService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
  })

  const runGuard = () => TestBed.runInInjectionContext(() => guardGuard(null as any, null as any)) as Observable<boolean>;

  it('Test 1: Must accept go ahead (true), if user already authorized', async () => {
    mockAuthService.isAuthenticated.and.returnValue(of(true));

    const canActivate = await lastValueFrom(runGuard());

    expect(canActivate).toBeTrue();
    expect(mockAuthService.checkAuth).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('Test 2: Must accept go ahead (true), if isAuthenticated=false, but checkAuth()=true', async () => {
    mockAuthService.isAuthenticated.and.returnValue(of(false));
    mockAuthService.checkAuth.and.returnValue(of(true));

    const canActivate = await lastValueFrom(runGuard());

    expect(canActivate).toBeTrue();
    expect(mockAuthService.checkAuth).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('Test 3: Must block go ahead (false) and move to /login,if user does not has authorization', async () => {
    mockAuthService.isAuthenticated.and.returnValue(of(false));
    mockAuthService.checkAuth.and.returnValue(of(false));

    const canActivate = await lastValueFrom(runGuard());

    expect(canActivate).toBeFalse();
    expect(mockAuthService.checkAuth).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
})
