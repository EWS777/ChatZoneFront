import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PasswordService} from './password.service';
import {RouterLink} from '@angular/router';

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
    oldPassword: new FormControl(null),
    newPassword: new FormControl(null),
    confirmedPassword: new FormControl(null)
  })

  onSubmit() {
    this.commonError = ''
    // if (this.password.value.newPassword!==this.password.value.confirmedPassword){
    //   console.log("Password is not the same!")
    // }
    // else {
    //   if (this.password.valid) {
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
      // }
    // }
  }
}
