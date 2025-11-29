import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ResetPasswordService} from './reset-password.service';

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

  email: string | null = null
  isSend = signal<boolean>(false)
  commonError: string = ''

  resetPasswordForm = new FormGroup({
    email: new FormControl(null)
  })

  onClick(){
    this.commonError = ''
    this.resetPasswordService.resetPassword(this.email).subscribe({
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
