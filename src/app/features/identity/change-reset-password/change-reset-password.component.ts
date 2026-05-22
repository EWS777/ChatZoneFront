import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ResetPassword} from './resetPassword';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ChangePasswordService} from './change-password.service';
import {CommonValidator} from '../../../shared/validation/CommonValidator';
import {matchValidator} from '../../../shared/validation/MatchValidator';

@Component({
  selector: 'app-change-reset-password',
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './change-reset-password.component.html',
  standalone: true,
  styleUrl: './change-reset-password.component.css'
})
export class ChangeResetPasswordComponent implements OnInit {
  route = inject(ActivatedRoute)
  service = inject(ChangePasswordService)
  commonError: string = ''
  hidePassword = signal<boolean>(true)
  isLoading = signal<boolean>(false)

  resetPasswordForm = new FormGroup({
    email: new FormControl(null, [
      Validators.email,
      CommonValidator.required,
      CommonValidator.minLength(5),
      CommonValidator.maxLength(254),
      CommonValidator.noSpaces, //just for strict attributes
    ]),
    newPassword: new FormControl(null, [
      CommonValidator.required,
      CommonValidator.minLength(8),
      CommonValidator.maxLength(64),
      CommonValidator.noSpaces, //just for strict attributes
    ]),
    confirmedPassword: new FormControl(null, [
      CommonValidator.required,
      CommonValidator.minLength(8),
      CommonValidator.maxLength(64),
      CommonValidator.noSpaces, //just for strict attributes
    ])
  }, {validators: matchValidator('newPassword', 'confirmedPassword')})

  resetPassword: ResetPassword = {
    token: '',
    password: '',
    email: ''
  };

  isPasswordChanged = signal<boolean>(false)

  ngOnInit() {
    this.resetPassword.token = this.route.snapshot.queryParamMap.get('link') ?? ''
  }

  update(){
    this.commonError = ''
    if (this.resetPasswordForm.invalid){
      this.resetPasswordForm.markAllAsTouched()
      return
    }
    const dataToSend: ResetPassword = {
      token: this.resetPassword.token,
      email: this.resetPasswordForm.controls.email.value!,
      password: this.resetPasswordForm.value.newPassword!
    };
    this.service.resetPassword(dataToSend).subscribe({
      next: () => {
        this.isPasswordChanged.set(true)
      },
      error: (err) => {
        if(err.status === 400 && err.error && err.error.errors){
          const errors = err.error.errors;

          Object.keys(errors).forEach(key => {
            const control = this.resetPasswordForm.get(key.charAt(0).toLowerCase() + key.slice(1))
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
    })
  }
}
