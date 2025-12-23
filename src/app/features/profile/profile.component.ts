import {Component, inject, OnInit} from '@angular/core';
import {ProfileService} from './profile.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Profile} from './profile';
import {Router} from '@angular/router';
import {CommonValidator} from '../../shared/validation/CommonValidator';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profileService = inject(ProfileService)
  router = inject(Router)

  profile!: Profile;
  oldUsername!: string;
  commonError: string = ''

  updateProfileForm = new FormGroup({
    username: new FormControl('', [
      CommonValidator.required,
      CommonValidator.minLength(8),
      CommonValidator.maxLength(30),
      CommonValidator.noSpaces, //just for strict attributes
      Validators.pattern(/^[a-zA-Z0-9_-]+$/)
    ])
  })

  ngOnInit() {
    this.profileService.getProfile()
      .subscribe(value => {
        this.profile = value
        this.oldUsername = value.username
        this.updateProfileForm.patchValue({
          username: value.username
        });
      })
  }

  onClickUpdate(){
    this.commonError = ''
    if (this.updateProfileForm.invalid){
      this.updateProfileForm.markAllAsTouched()
      return
    }
    const profileToSend = {
      ...this.profile,
      username: this.updateProfileForm.controls.username.value!
    };
    this.profileService.updateProfile(this.oldUsername, profileToSend)
      .subscribe({
        next: value => {
          this.profile = value
          this.oldUsername = value.username
        },
        error: (err) => {
          if(err.status === 400 && err.error && err.error.errors){
            const errors = err.error.errors;

            Object.keys(errors).forEach(key => {
              const control = this.updateProfileForm.get(key.charAt(0).toLowerCase() + key.slice(1))
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

  onClickDeleteProfile(){
    this.router.navigate([`delete-profile`])
  }

  onClickUpdatePassword(){
    this.router.navigate([`update-password`])
  }
}
