import {Component, inject, OnInit} from '@angular/core';
import {BlockedUserService} from './blocked-user.service';
import {BlockedUser} from './blocked-user';
import {map} from 'rxjs';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-blocked-users',
  imports: [
    DatePipe
  ],
  templateUrl: './blocked-users.component.html',
  standalone: true,
  styleUrl: './blocked-users.component.css'
})
export class BlockedUsersComponent implements OnInit{
  blockedUserService = inject(BlockedUserService)
  blockedUser: BlockedUser[] | null = null


  ngOnInit() {
    this.blockedUserService.getBlockedPersons().subscribe({
      next: value => {
        this.blockedUser = value
      },
      error: err => {
        console.error('Get blocked users has not completed!', err)
      }
    })
  }

  delete(id: number){
    this.blockedUserService.deleteBlockedPerson(id).pipe(
      map(() => this.blockedUser?.filter(x=>x.idBlockedPerson !==id)??[])
    ).subscribe({
      next: value => {
        this.blockedUser = value
      },
      error: err => {
        console.error('Delete has not completed!', err)
      }
    })
  }
}
