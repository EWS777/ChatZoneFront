import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthorizationService} from './authorization.service';
import {Router, RouterLink} from '@angular/router';

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
  isLogin = signal<boolean>(true)

  isConfirmEmailPage = signal<boolean>(false)


  loginForm = new FormGroup({
    usernameOrEmail: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
    password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]})
  })

  registrationForm = new FormGroup({
    username: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
    email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
    password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
    confirmedPassword: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]})
  })

  authService = inject(AuthorizationService)
  route = inject(Router)

  onLoginSubmit(){
    if (this.loginForm.valid){
      //@ts-ignore
      this.authService.postLogin(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Вход выполнен');
          this.route.navigate([''])
        },
        error: (err) => {
          console.error('Ошибка входа:', err);
        }
      })
    }
  }
  onRegistrationSubmit(){
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const dataToSend = {
      email: this.registrationForm.get('email')?.value,
      username: this.registrationForm.get('username')?.value,
      password: this.registrationForm.get('password')?.value
    }

    // @ts-ignore
    this.authService.registerLogin(dataToSend).subscribe({
      next: value => {
        console.log('Регистрация прошла успешно', value);
        this.isConfirmEmailPage.set(true)
      },
      error: (err) => {
        console.error('Ошибка входа:', err);
      }
    });
  }
}
