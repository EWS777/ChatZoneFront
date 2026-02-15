import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

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
  isDropdownOpen = false; // Состояние меню

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  get activePageName(): string {
    const current = this.menuItems.find(item => this.router.url.includes(item.link));
    return current ? current.name : 'Menu';
  }

  menuItems = [
    { name: 'Profile', link: '/profile'},
    { name: 'Filter', link: 'filter'},
    { name: 'Quick messages', link: 'quick-messages'},
    { name: 'Blocked users', link: 'blocked-users'}
  ]
}
