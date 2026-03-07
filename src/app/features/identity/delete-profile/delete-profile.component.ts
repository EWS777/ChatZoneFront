import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CommonValidator} from '../../../shared/validation/CommonValidator';
import {Router, RouterLink} from '@angular/router';
import {DeleteProfileService} from './delete-profile.service';

@Component({
  selector: 'app-delete-profile',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './delete-profile.component.html',
  styleUrl: './delete-profile.component.css'
})
export class DeleteProfileComponent {
  service = inject(DeleteProfileService)
  router = inject(Router)

  hidePassword = signal<boolean>(true)
  isLoading = signal<boolean>(false)
  isDeleteProfile = signal<boolean>(false)

  commonError: string = ''

  deleteProfileForm = new FormGroup({
    password: new FormControl(null, {validators: [
        CommonValidator.required,
        CommonValidator.minLength(8),
        CommonValidator.maxLength(64),
        CommonValidator.noSpaces, //just for strict attributes
      ]})
  })

  deleteProfileSubmit(){
    this.commonError = ''
    if (this.deleteProfileForm.invalid){
      this.deleteProfileForm.markAllAsTouched()
      return
    }
    this.isLoading.set(true)

    const payload = { password: this.deleteProfileForm.controls.password.value! };

    this.service.deleteProfileService(payload).subscribe({
      next: () =>{
        this.isLoading.set(false)
        this.isDeleteProfile.set(true)
      },
      error: (err) => {
        this.isLoading.set(false)
        if(err.status === 400 && err.error && err.error.errors){
          const errors = err.error.errors;

          Object.keys(errors).forEach(key => {
            const control = this.deleteProfileForm.get(key.charAt(0).toLowerCase() + key.slice(1))
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
