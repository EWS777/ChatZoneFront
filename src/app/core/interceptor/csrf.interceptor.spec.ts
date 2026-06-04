import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { csrfInterceptor } from './csrf.interceptor';

describe('csrfInterceptor (CSRF)', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([csrfInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Test 1: must add X-XSRF-TOKEN for POST-requests, if cookies exists', () => {
    document.cookie = 'XSRF-TOKEN=test-secret-token; path=/';

    http.post('/api/test', {}).subscribe();

    const req = httpTestingController.expectOne('/api/test');

    expect(req.request.headers.has('X-XSRF-TOKEN')).toBeTrue();
    expect(req.request.headers.get('X-XSRF-TOKEN')).toBe('test-secret-token');
  });

  it('Test 2: should not add X-XSRF-TOKEN for GET-requests, if cookies exists', () => {
    document.cookie = 'XSRF-TOKEN=test-secret-token; path=/';

    http.get('/api/test').subscribe();

    const req = httpTestingController.expectOne('/api/test');

    expect(req.request.headers.has('X-XSRF-TOKEN')).toBeFalse();
  });


  it('Test 3: should not add X-XSRF-TOKEN for POST-requests, if cookies not exists', () => {
    http.post('/api/test', {}).subscribe();

    const req = httpTestingController.expectOne('/api/test');

    expect(req.request.headers.has('X-XSRF-TOKEN')).toBeFalse();
  });
});
