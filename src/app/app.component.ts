import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthorizationComponent} from './pages/authorization/authorization.component';
import {ProfileService} from './services/profile.service';
import {JsonPipe} from '@angular/common';
import {ProfileFromVideo} from './interfaces/profileFromVideo.interface';

@Component({
  selector: 'app-root',
  standalone: true, //?
  imports: [RouterOutlet, AuthorizationComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ChatZoneFront';

  profileService = inject(ProfileService)
  profiles: ProfileFromVideo[] = []
  constructor() {
    this.profileService.getTestAccounts()
      .subscribe(value => {
        this.profiles = value
      })
  }
}
