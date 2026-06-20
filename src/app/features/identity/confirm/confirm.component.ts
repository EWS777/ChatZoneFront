import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ConfirmService} from './confirm.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonValidator} from '../../../shared/validation/CommonValidator';

@Component({
  selector: 'app-confirm',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent implements OnInit{
  router = inject(Router)
  route = inject(ActivatedRoute)
  confirmService = inject(ConfirmService)
  commonError: string = ''
  successMessage = signal<string>('')

  isConfirmed = signal<boolean | null>(null)
  confirmEmailForm = new FormGroup({
    email: new FormControl<string | null>(null, {validators: [
        Validators.email,
        CommonValidator.required,
        CommonValidator.minLength(5),
        CommonValidator.maxLength(254),
        CommonValidator.noSpaces, //just for strict attributes
      ]})
  })

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('link')
    if (token){
      this.confirmService.confirm(token).subscribe({
        next: () => {
          this.isConfirmed.set(true)
          this.router.navigate([''])
        },
        error: (err) => {
          this.isConfirmed.set(false)
          this.commonError = err.error.title || 'Unhandled exception. To repair'
        }
      })
    }else {
      console.log('Token is not exists!')
    }
  }

  reconfirm(){
    this.successMessage.set('')
    if (this.confirmEmailForm.invalid) {
      this.confirmEmailForm.markAsTouched();
      return;
    }
    const emailValue = this.confirmEmailForm.get('email')?.value;
    this.confirmService.reconfirm(emailValue!).subscribe({
      next: (response) => {
        const msg = response.message || 'Link was sent successfully!';
        this.successMessage.set(msg);
      },
      error: (err) => {
        this.commonError = err.error.title || 'Unhandled exception. To repair'
      }
    })
  }
}
