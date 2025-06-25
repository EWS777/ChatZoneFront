import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmService} from './confirm.service';

@Component({
  selector: 'app-confirm',
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent implements OnInit{

  router = inject(Router)
  route = inject(ActivatedRoute)

  confirmService = inject(ConfirmService)

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('link')

    if (token){
      this.confirmService.confirm(token).subscribe()
    }else {
      console.log('Token is not exists!')
    }
    }

}
