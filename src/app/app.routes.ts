import { Routes } from '@angular/router';
import {AuthorizationComponent} from './features/authorization/authorization.component';
import {MainComponent} from './features/main/main.component';
import {ProfileComponent} from './features/profile/profile.component';
import {ResetPasswordComponent} from './features/reset-password/reset-password.component';
import {BlockedUsersComponent} from './features/profile/blocked-users/blocked-users.component';
import {FilterComponent} from './features/profile/filter/filter.component';
import {QuickMessagesComponent} from './features/profile/quick-messages/quick-messages.component';

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: AuthorizationComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'profile/:username', component: ProfileComponent},
  {path: 'profile/:username/filter', component: FilterComponent},
  {path: 'profile/:username/blocked-users', component: BlockedUsersComponent},
  {path: 'profile/:username/quick-messages', component: QuickMessagesComponent},
];
