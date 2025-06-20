import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-profile-side-bar',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './profile-side-bar.component.html',
  styleUrl: './profile-side-bar.component.css'
})
export class ProfileSideBarComponent {
  menuItems = [
    {
      name: 'Profile',
      link: '/profile'
    },
    {
      name: 'Filter',
      link: 'filter'
    },
    {
      name: 'Quick messages',
      link: 'quick-messages'
    },
    {
      name: 'Blocked users',
      link: 'blocked-users'
    }
  ]
}
