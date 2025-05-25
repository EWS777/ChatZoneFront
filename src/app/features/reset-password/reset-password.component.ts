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
    this.resetPasswordService.resetPassword({email: this.email}).subscribe({
      next: value => {
        this.isSend.set(true);
      }
    });

  }
}
