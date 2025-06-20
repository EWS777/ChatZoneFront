import {Component, inject, OnInit} from '@angular/core';
import {ProfileService} from './profile.service';
import {FormsModule} from '@angular/forms';
import {Profile} from './profile';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profileService = inject(ProfileService)

  profile!: Profile;

  ngOnInit() {
    this.profileService.getProfile()
      .subscribe(value => {
        this.profile = value
      })
  }
}
