import { Routes } from '@angular/router';
import {AuthorizationComponent} from './features/identity/authorization/authorization.component';
import {MainComponent} from './features/main/main.component';
import {ProfileComponent} from './features/profile/profile.component';
import {ResetPasswordComponent} from './features/identity/reset-password/reset-password.component';
import {BlockedUsersComponent} from './features/profile/blocked-users/blocked-users.component';
import {FilterComponent} from './features/profile/filter/filter.component';
import {QuickMessagesComponent} from './features/profile/quick-messages/quick-messages.component';
import {ProfileSideBarComponent} from './shared/profile-side-bar/profile-side-bar.component';
import {guardGuard} from './core/guard/guard.guard';
import {ConfirmComponent} from './features/identity/confirm/confirm.component';
import {UpdatePasswordComponent} from './features/identity/update-password/update-password.component';
import {DeleteProfileComponent} from './features/identity/delete-profile/delete-profile.component';

export const routes: Routes = [
  {
    path: 'profile', component: ProfileSideBarComponent, children: [
      {path: 'me', component: ProfileComponent},
      {path: 'filter', component: FilterComponent},
      {path: 'blocked-users', component: BlockedUsersComponent},
      {path: 'quick-messages', component: QuickMessagesComponent}
    ], canActivate: [guardGuard]
  },
  {path: '', component: MainComponent},
  {path: 'login', component: AuthorizationComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'confirm', component: ConfirmComponent},
  {path: 'update-password', component: UpdatePasswordComponent, canActivate: [guardGuard]},
  {path: 'delete-profile', component: DeleteProfileComponent, canActivate: [guardGuard]}
];
