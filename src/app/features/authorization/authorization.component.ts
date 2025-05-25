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


  loginForm = new FormGroup({
    usernameOrEmail: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  })

  registrationForm = new FormGroup({
    username: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    confirmedPassword: new FormControl(null, Validators.required)
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

  }
}
