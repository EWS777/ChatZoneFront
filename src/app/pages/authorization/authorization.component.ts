import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Profile} from '../../interfaces/profile.interface';

@Component({
  selector: 'authorization-app', //the name of Component, also should be as unique
  templateUrl: 'authorization.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrl: 'authorization.component.css'
})

export class AuthorizationComponent{
  // age: number = 13;
  // surname: string = "Jane";

  /*form = new FormGroup({
    email: new FormControl(null),
    username: new FormControl(null),
    password: new FormControl(null),
    passwordConfirmed: new FormControl(null),
  })*/

  loginForm = new FormGroup({
    usernameOrEmail: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  })

  onSubmit(){

    if (this.loginForm.valid){
      //@ts-ignore
      this.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Вход выполнен');
        },
        error: (err) => {
          console.error('Ошибка входа:', err);
        }
      })
    }
  }

  http = inject(HttpClient)
  baseApiUrl = 'https://localhost:7212/'


  login(payload: {usernameOrEmail: string, Password: string}){
    return this.http.post(`${this.baseApiUrl}login`, payload)
  }

}
