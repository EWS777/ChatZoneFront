import {Component, inject} from '@angular/core';
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

  password = new FormGroup({
    oldPassword: new FormControl(null, {validators: [Validators.required]}),
    newPassword: new FormControl(null, {validators: [Validators.required]}),
    confirmedPassword: new FormControl(null, {validators: [Validators.required]})
  })

  onSubmit() {
    if (this.password.value.newPassword!==this.password.value.confirmedPassword){
      console.log("Password is not the same!")
    }
    else {
      if (this.password.valid) {
        const payload = {
          oldPassword: this.password.value.oldPassword!,
          newPassword: this.password.value.newPassword!
        };

        this.passwordService.updatePassword(payload).subscribe({
          next: () => {},
          error: err => {
            console.log('Can not updated!', err)
          }
        })
      }
    }
  }
}
