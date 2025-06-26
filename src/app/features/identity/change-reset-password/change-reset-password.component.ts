import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ResetPassword} from './resetPassword';
import {FormsModule} from '@angular/forms';
import {ChangePasswordService} from './change-password.service';

@Component({
  selector: 'app-change-reset-password',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './change-reset-password.component.html',
  styleUrl: './change-reset-password.component.css'
})
export class ChangeResetPasswordComponent implements OnInit {
  route = inject(ActivatedRoute)
  service = inject(ChangePasswordService)

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
    this.service.resetPassword(this.resetPassword).subscribe({
      next: () => {
        this.isPasswordChanged.set(true)
      },
      error: err => {
        console.error('Error is exists!', err)
      }
    })
  }
}
