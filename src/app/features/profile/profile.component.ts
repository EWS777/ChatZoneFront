import {Component, inject} from '@angular/core';
import {ProfileService} from './profile.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileService = inject(ProfileService)

  onInit(){
    // this.profileService.getProfile()
  }
}
