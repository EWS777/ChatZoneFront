import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmService} from './confirm.service';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonValidator} from '../../../shared/validation/CommonValidator';

@Component({
  selector: 'app-confirm',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent implements OnInit{
  router = inject(Router)
  route = inject(ActivatedRoute)
  confirmService = inject(ConfirmService)
  commonError: string = ''
  commonErrorReconfirm: string = ''
  successMessage = signal<string>('')

  isConfirmed = signal<boolean | null>(null)
  emailControl = new FormControl(null, [
    Validators.email,
    CommonValidator.required,
    CommonValidator.minLength(5),
    CommonValidator.maxLength(254),
    CommonValidator.noSpaces, //just for strict attributes
  ])

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
    this.commonErrorReconfirm = ''
    this.successMessage.set('')
    if (this.emailControl.invalid) {
      this.emailControl.markAsTouched();
      return;
    }
    const emailValue = (this.emailControl.value || '').trim()
    this.confirmService.reconfirm(emailValue).subscribe({
      next: (response: any) => {
        const msg = response?.message || 'Link was sent successfully!';

        console.log('Server response:', response);
        this.successMessage.set(msg);
      },
      error: (err) => {
        this.commonErrorReconfirm = err.error.title || 'Unhandled exception. To repair'
      }
    })
  }
}
