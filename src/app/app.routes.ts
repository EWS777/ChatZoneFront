import { Routes } from '@angular/router';
import {AuthorizationComponent} from './pages/authorization/authorization.component';
import {MainComponent} from './pages/main/main.component';

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: AuthorizationComponent}
];
