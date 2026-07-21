import { Component, inject, OnInit, signal } from '@angular/core';
import { BlockedUserService } from './blocked-user.service';
import { BlockedUser } from './blocked-user';
import { map } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MENU_ITEMS } from '../../../shared/profile-side-bar/profile-side-bar.component';
import { AuthorizationService } from '../../identity/authorization/authorization.service';
import { InfiniteScrollDirective } from '../../../shared/directive/infinite-scroll.directive';

@Component({
  selector: 'app-blocked-users',
  imports: [
    DatePipe,
    RouterLink,
    InfiniteScrollDirective
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

  readonly takePerson = 10
  isLoading = signal<boolean>(false)
  hasNextPage = signal<boolean>(true)
  lastCrusor = signal<string | Date | null>(null)

  ngOnInit() {
    this.loadMore()
  }

  loadMore(){
    if (this.isLoading() || !this.hasNextPage()) return

    this.isLoading.set(true)

    this.blockedUserService.getBlockedPersons(this.takePerson, this.lastCrusor()).subscribe({
      next: (newPersons) => {
        const items = newPersons ?? []

        this.blockedUser = [...(this.blockedUser ?? []), ...items];

        if (items.length < this.takePerson) this.hasNextPage.set(false)

        if (items.length > 0) this.lastCrusor.set(items[items.length - 1].createdAt)

        this.isLoading.set(false)
      },
      error: () => this.isLoading.set(false)
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
