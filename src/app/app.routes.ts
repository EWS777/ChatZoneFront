import { Routes } from '@angular/router';
import { guardGuard } from './core/guard/guard.guard';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./shared/profile-side-bar/profile-side-bar.component').then(x => x.ProfileSideBarComponent),
    canActivate: [guardGuard],
    children: [
      { path: '', loadComponent: () => import('./features/profile/profile.component').then(x => x.ProfileComponent) },
      {
        path: 'blocked-users',
        loadComponent: () => import('./features/profile/blocked-users/blocked-users.component').then(x => x.BlockedUsersComponent)
      },
      {
        path: 'quick-messages',
        loadComponent: () => import('./features/profile/quick-messages/quick-messages.component').then(x => x.QuickMessagesComponent)
      }
    ],
  },
  { path: '', loadComponent: () => import('./features/main/main.component').then(x => x.MainComponent) },
  {
    path: 'login',
    loadComponent: () => import('./features/identity/authorization/authorization.component').then(x => x.AuthorizationComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/identity/reset-password/reset-password.component').then(x => x.ResetPasswordComponent)
  },
  {
    path: 'reset',
    loadComponent: () => import('./features/identity/change-reset-password/change-reset-password.component').then(x => x.ChangeResetPasswordComponent)
  },
  {
    path: 'confirm',
    loadComponent: () => import('./features/identity/confirm/confirm.component').then(x => x.ConfirmComponent)
  },
  {
    path: 'update-password',
    loadComponent: () => import('./features/identity/update-password/update-password.component').then(x => x.UpdatePasswordComponent),
    canActivate: [guardGuard]
  },
  {
    path: 'delete-profile',
    loadComponent: () => import('./features/identity/delete-profile/delete-profile.component').then(x => x.DeleteProfileComponent),
    canActivate: [guardGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/common/chat.component').then(x => x.ChatComponent),
    canActivate: [guardGuard]
  },
  {
    path: 'groups',
    loadComponent: () => import('./features/chat/group-chat-menu/group-chat-menu.component').then(x => x.GroupChatMenuComponent),
    canActivate: [guardGuard]
  },
];
