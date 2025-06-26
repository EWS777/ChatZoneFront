import {Component, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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

  email!: string;
  isSend = signal<boolean>(false)

  onClick(){
    this.resetPasswordService.resetPassword(this.email).subscribe({
      next: () => {
        this.isSend.set(true);
      },
      error: err => {
        console.log('Can not competed successfully!', err)
      }
    });

  }
}
