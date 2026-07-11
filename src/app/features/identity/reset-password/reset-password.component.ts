import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';
import { CommonValidator } from '../../../shared/validation/CommonValidator';
import { handleBackendErrors } from '../../../shared/utils/backend-error-handler';

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
  isLoading = signal<boolean>(false)
  commonError: string = ''

  resetPasswordForm = new FormGroup({
    email: new FormControl(null, { validators: [
        Validators.email,
        CommonValidator.required,
        CommonValidator.minLength(5),
        CommonValidator.maxLength(254),
        CommonValidator.noSpaces, //just for strict attributes
      ] })
  })

  onClick() {
    this.commonError = ''
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched()
      return
    }
    this.isLoading.set(true)
    const email = this.resetPasswordForm.get('email')?.value ?? null;
    this.resetPasswordService.resetPassword(email).subscribe({
      next: () => {
        this.isLoading.set(false)
        this.isSend.set(true);
      },
      error: (err) => handleBackendErrors(err, this.resetPasswordForm, this)
    });

  }
}
