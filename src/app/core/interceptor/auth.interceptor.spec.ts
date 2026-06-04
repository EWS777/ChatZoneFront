import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthorizationService } from '../../features/identity/authorization/authorization.service';
import { of, throwError } from 'rxjs';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthorizationService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthorizationService', ['refreshToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthorizationService, useValue: mockAuthService },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should pass the request through if there is no error', () => {
    http.get('/api/data').subscribe();

    const req = httpTestingController.expectOne('/api/data');
    req.flush({ data: 'test success' });

    expect(mockAuthService.refreshToken).not.toHaveBeenCalled();
  });

  it('should call refreshToken and retry the request if 401 error occurs', () => {
    mockAuthService.refreshToken.and.returnValue(of(true));

    http.get('/api/data').subscribe();

    const req1 = httpTestingController.expectOne('/api/data');
    req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockAuthService.refreshToken).toHaveBeenCalled();

    const req2 = httpTestingController.expectOne('/api/data');
    req2.flush({ data: 'retry success' });
  });

  it('should NOT call refreshToken if the url ends with /refresh (prevents infinite loop)', () => {
    http.post('/api/refresh', {}).subscribe({
      error: (err) => {
        expect(err.status).toBe(401);
      }
    });

    const req = httpTestingController.expectOne('/api/refresh');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockAuthService.refreshToken).not.toHaveBeenCalled();
  });

  it('should pass the error through if refreshToken fails', () => {
    mockAuthService.refreshToken.and.returnValue(throwError(() => new Error('Refresh failed')));

    http.get('/api/data').subscribe({
      error: (err) => {
        expect(err.message).toBe('Refresh failed');
      }
    });

    const req = httpTestingController.expectOne('/api/data');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockAuthService.refreshToken).toHaveBeenCalled();
  });

  it('should pass the error through for non-401 errors (e.g., 500 Internal Server Error)', () => {
    http.get('/api/data').subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });

    const req = httpTestingController.expectOne('/api/data');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(mockAuthService.refreshToken).not.toHaveBeenCalled();
  });
});
