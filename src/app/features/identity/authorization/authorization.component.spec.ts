import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorizationComponent } from './authorization.component';
import { AuthorizationService } from './authorization.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('AuthorizationComponent (Login and Registration Forms)', () => {
  let component: AuthorizationComponent;
  let fixture: ComponentFixture<AuthorizationComponent>;
  let mockAuthService: jasmine.SpyObj<AuthorizationService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthorizationService', ['postLogin', 'registerLogin']);

    await TestBed.configureTestingModule({
      imports: [
        AuthorizationComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthorizationService, useValue: mockAuthService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorizationComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // LOGIN FORM TESTS
  describe('Login Form', () => {
    it('should be invalid when empty', () => {
      expect(component.loginForm.invalid).toBeTrue();
    });

    it('should not call authService.postLogin if the form is invalid', () => {
      component.onLoginSubmit();

      expect(component.loginForm.touched).toBeTrue();
      expect(mockAuthService.postLogin).not.toHaveBeenCalled();
    });

    it('should call authService and navigate to home on successful login', () => {
      component.loginForm.patchValue({
        usernameOrEmail: 'validUser',
        password: 'validPassword123'
      });

      mockAuthService.postLogin.and.returnValue(of({}));

      component.onLoginSubmit();

      expect(mockAuthService.postLogin).toHaveBeenCalled();
      expect(component.isLoading()).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });

    it('should handle 400 Bad Request and map backend errors to form controls', () => {
      component.loginForm.patchValue({
        usernameOrEmail: 'validUser',
        password: 'validPassword123'
      });

      const mockErrorResponse = {
        status: 400,
        error: {
          errors: {
            Password: 'Password is too weak',
            UsernameOrEmail: 'User not found'
          }
        }
      };
      mockAuthService.postLogin.and.returnValue(throwError(() => mockErrorResponse));

      component.onLoginSubmit();

      expect(component.loginForm.get('password')?.errors?.['backend']).toBe('Password is too weak');
      expect(component.loginForm.get('usernameOrEmail')?.errors?.['backend']).toBe('User not found');
      expect(component.isLoading()).toBeFalse();
    });

    it('should set commonErrorLogin for non-400 errors (e.g. 500 Server Error)', () => {
      component.loginForm.patchValue({ usernameOrEmail: 'test11111', password: 'password123' });

      const mockErrorResponse = {
        status: 500,
        error: { title: 'Internal Server Error' }
      };
      mockAuthService.postLogin.and.returnValue(throwError(() => mockErrorResponse));

      component.onLoginSubmit();

      expect(component.commonErrorLogin).toBe('Internal Server Error');
    });
  });

  // REGISTRATION FORM TESTS
  describe('Registration Form', () => {
    it('should be invalid when empty', () => {
      expect(component.registrationForm.invalid).toBeTrue();
    });

    it('should be invalid if passwords do not match (testing matchValidator)', () => {
      component.registrationForm.patchValue({
        username: 'validUsername',
        email: 'test@mail.com',
        password: 'password123',
        confirmedPassword: 'differentPassword'
      });

      expect(component.registrationForm.invalid).toBeTrue();
    });

    it('should call authService and show confirm email page on successful registration', () => {
      component.registrationForm.patchValue({
        username: 'validUsername',
        email: 'test@mail.com',
        password: 'password123',
        confirmedPassword: 'password123'
      });

      mockAuthService.registerLogin.and.returnValue(of({}));

      component.onRegistrationSubmit();

      expect(mockAuthService.registerLogin).toHaveBeenCalled();
      expect(component.isLoading()).toBeFalse();
      expect(component.isConfirmEmailPage()).toBeTrue();
    });
  });
});
