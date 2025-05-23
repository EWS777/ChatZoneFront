import { Routes } from '@angular/router';
import {AuthorizationComponent} from './pages/authorization/authorization.component';
import {MainComponent} from './pages/main/main.component';
import {ProfileComponent} from './pages/profile/profile.component';

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: AuthorizationComponent},
  {path: 'profile/:username', component: ProfileComponent}
];
