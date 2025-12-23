import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ResetPasswordService} from './reset-password.service';
import {CommonValidator} from '../../../shared/validation/CommonValidator';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  standalone: true,
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPasswordService = inject(ResetPasswordService)

  isSend = signal<boolean>(false)
  commonError: string = ''

  resetPasswordForm = new FormGroup({
    email: new FormControl(null, {validators: [
        Validators.email,
        CommonValidator.required,
        CommonValidator.minLength(5),
        CommonValidator.maxLength(254),
        CommonValidator.noSpaces, //just for strict attributes
      ]})
  })

  onClick(){
    this.commonError = ''
    if (this.resetPasswordForm.invalid){
      this.resetPasswordForm.markAllAsTouched()
      return
    }
    const email = this.resetPasswordForm.get('email')?.value ?? null;
    this.resetPasswordService.resetPassword(email).subscribe({
      next: () => {
        this.isSend.set(true);
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
    });

  }
}
