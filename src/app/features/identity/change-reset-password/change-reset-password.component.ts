import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ResetPassword} from './resetPassword';
import {FormControl, FormGroup, FormsModule} from '@angular/forms';
import {ChangePasswordService} from './change-password.service';

@Component({
  selector: 'app-change-reset-password',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './change-reset-password.component.html',
  standalone: true,
  styleUrl: './change-reset-password.component.css'
})
export class ChangeResetPasswordComponent implements OnInit {
  route = inject(ActivatedRoute)
  service = inject(ChangePasswordService)
  commonError: string = ''

  resetPasswordForm = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null)
  })

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
    this.service.resetPassword(this.resetPassword).subscribe({
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
