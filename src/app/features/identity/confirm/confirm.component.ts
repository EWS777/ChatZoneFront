import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmService} from './confirm.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-confirm',
  imports: [
    FormsModule
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent implements OnInit{
  router = inject(Router)
  route = inject(ActivatedRoute)
  confirmService = inject(ConfirmService)

  isConfirmed = signal<boolean | null>(null)
  email: string | null = null

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('link')
    if (token){
      this.confirmService.confirm(token).subscribe({
        next: () => {
          this.isConfirmed.set(true)
          this.router.navigate([''])
        },
        error: err => {
          this.isConfirmed.set(false)
          console.log('Have not confirmed!', err)
        }
      })
    }else {
      console.log('Token is not exists!')
    }
  }

  reconfirm(){
    this.confirmService.reconfirm(this.email!).subscribe({
      next: () => {
        this.router.navigate([''])
      },
      error: err => {
        console.log('Has not confirm again!', err)
      }
    })
  }
}
