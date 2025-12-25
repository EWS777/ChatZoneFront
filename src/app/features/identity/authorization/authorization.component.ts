import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthorizationService} from './authorization.service';
import {Router, RouterLink} from '@angular/router';
import {CommonValidator} from '../../../shared/validation/CommonValidator';
import {matchValidator} from '../../../shared/validation/MatchValidator';

@Component({
  selector: 'authorization-app', //the name of Component, also should be as unique
  templateUrl: 'authorization.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  styleUrl: 'authorization.component.css'
})

export class AuthorizationComponent{
  authService = inject(AuthorizationService)
  route = inject(Router)

  isLogin = signal<boolean>(true)
  isConfirmEmailPage = signal<boolean>(false)
  isLoading = signal<boolean>(false)
  hidePassword = signal<boolean>(true)
  commonError: string = ''
  commonErrorLogin: string = ''

  loginForm = new FormGroup({
    usernameOrEmail: new FormControl(null, {validators:[
      CommonValidator.required,
        CommonValidator.noSpaces,
        CommonValidator.usernameOrEmailSmart
      ]}),
    password: new FormControl(null, {validators: [
        CommonValidator.required,
        CommonValidator.minLength(8),
        CommonValidator.maxLength(64),
        CommonValidator.noSpaces, //just for strict attributes
      ]})
  })

  registrationForm = new FormGroup({
    username: new FormControl(null, [
      CommonValidator.required,
      CommonValidator.minLength(8),
      CommonValidator.maxLength(30),
      CommonValidator.noSpaces, //just for strict attributes
      Validators.pattern(/^[a-zA-Z0-9_-]+$/)
    ]),
    email: new FormControl(null, {validators: [
      Validators.email,
      CommonValidator.required,
      CommonValidator.minLength(5),
      CommonValidator.maxLength(254),
      CommonValidator.noSpaces, //just for strict attributes
      ]}),
    password: new FormControl(null, {validators: [
        CommonValidator.required,
        CommonValidator.minLength(8),
        CommonValidator.maxLength(64),
        CommonValidator.noSpaces, //just for strict attributes
      ]}),
    confirmedPassword: new FormControl(null, {validators: [
        CommonValidator.required,
        CommonValidator.minLength(8),
        CommonValidator.maxLength(64),
        CommonValidator.noSpaces, //just for strict attributes
      ]})
  }, {validators: matchValidator('password', 'confirmedPassword')})

  onLoginSubmit(){
    this.commonErrorLogin = ''
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched()
      return
    }
    this.isLoading.set(true)
    //   @ts-ignore
      this.authService.postLogin(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading.set(false)
          console.log('Вход выполнен');
          this.route.navigate([''])
        },
        error: (err) => {
          this.isLoading.set(false)
          if(err.status === 400 && err.error && err.error.errors){
            const errors = err.error.errors;

            Object.keys(errors).forEach(key => {
              const control = this.loginForm.get(key.charAt(0).toLowerCase() + key.slice(1))
              if (control) {
                control.setErrors({ backend: errors[key] });
                control.markAsTouched()
              }
            });
          }
          else{
            this.commonErrorLogin = err.error.title || 'Unhandled exception. To repair'
          }
        }
      })
  }

  onRegistrationSubmit(){
    this.commonError = ''
    if (this.registrationForm.invalid){
      this.registrationForm.markAllAsTouched()
      return
    }
    this.isLoading.set(true)
      const dataToSend = {
        email: (this.registrationForm.get('email')?.value as string | null)?.trim().toLowerCase(),
        username: this.registrationForm.get('username')?.value,
        password: this.registrationForm.get('password')?.value
      }

      // @ts-ignore
      this.authService.registerLogin(dataToSend).subscribe({
        next: value => {
          this.isLoading.set(false)
          console.log('Регистрация прошла успешно', value);
          this.isConfirmEmailPage.set(true)
        },
        error: (err) => {
          this.isLoading.set(false)
          if(err.status === 400 && err.error && err.error.errors){
            const errors = err.error.errors;

            Object.keys(errors).forEach(key => {
              const control = this.registrationForm.get(key.charAt(0).toLowerCase() + key.slice(1))
              if (control) {
                control.setErrors({ backend: errors[key] });
                control.markAsTouched()
              }
            });
          }
          else{
            this.commonError = err.error.title || 'Unhandled exception. To repair'
          }
        }
      });
  }
}
