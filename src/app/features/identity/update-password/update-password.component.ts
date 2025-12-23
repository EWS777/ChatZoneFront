import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {PasswordService} from './password.service';
import {RouterLink} from '@angular/router';
import {CommonValidator} from '../../../shared/validation/CommonValidator';
import {matchValidator} from '../../../shared/validation/MatchValidator';

@Component({
  selector: 'app-update-password',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent {
  passwordService = inject(PasswordService)
  commonError: string = ''
  isPasswordChanged = signal<boolean>(false)

  passwordForm = new FormGroup({
    oldPassword: new FormControl(null, [
      CommonValidator.required,
      CommonValidator.minLength(8),
      CommonValidator.maxLength(64),
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

  onSubmit() {
    this.commonError = ''
    if (this.passwordForm.invalid){
      this.passwordForm.markAllAsTouched()
      return
    }
        const payload = {
          oldPassword: this.passwordForm.value.oldPassword || null,
          newPassword: this.passwordForm.value.newPassword || null
        };

        this.passwordService.updatePassword(payload).subscribe({
          next: () => {
            this.isPasswordChanged.set(true)
          },
          error: (err) => {
            if(err.status === 400 && err.error && err.error.errors){
              const errors = err.error.errors;

              Object.keys(errors).forEach(key => {
                const control = this.passwordForm.get(key.charAt(0).toLowerCase() + key.slice(1))
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
