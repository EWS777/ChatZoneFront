import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthorizationService } from '../../features/identity/authorization/authorization.service';

export const MENU_ITEMS = [
  { name: 'Profile', link: '/profile', icon: 'profile' },
  { name: 'Quick messages', link: '/profile/quick-messages', icon: 'messages' },
  { name: 'Blocked users', link: '/profile/blocked-users', icon: 'blocked' }
]

@Component({
  selector: 'app-profile-side-bar',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './profile-side-bar.component.html',
  styleUrl: './profile-side-bar.component.css'
})
export class ProfileSideBarComponent {
  router = inject(Router)
  authService = inject(AuthorizationService)

  protected readonly MENU_ITEMS = MENU_ITEMS;
}
