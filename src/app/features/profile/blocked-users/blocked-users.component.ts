import { Component, inject, OnInit, signal } from '@angular/core';
import { BlockedUserService } from './blocked-user.service';
import { BlockedUser } from './blocked-user';
import { map } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MENU_ITEMS } from '../../../shared/profile-side-bar/profile-side-bar.component';
import { AuthorizationService } from '../../identity/authorization/authorization.service';

@Component({
  selector: 'app-blocked-users',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './blocked-users.component.html',
  standalone: true,
  styleUrl: './blocked-users.component.css'
})
export class BlockedUsersComponent implements OnInit {
  blockedUserService = inject(BlockedUserService)
  authService = inject(AuthorizationService);
  blockedUser: BlockedUser[] | null = null
  isMenuOpen = signal<boolean>(false)
  protected readonly MENU_ITEMS = MENU_ITEMS;

  ngOnInit() {
    this.blockedUserService.getBlockedPersons().subscribe({
      next: value => {
        this.blockedUser = value
      },
      error: () => {}
    })
  }

  delete(id: number) {
    this.blockedUserService.deleteBlockedPerson(id).pipe(
      map(() => this.blockedUser?.filter(x => x.idBlockedPerson !== id) ?? [])
    ).subscribe({
      next: value => {
        this.blockedUser = value
      },
      error: () => {}
    })
  }
}
