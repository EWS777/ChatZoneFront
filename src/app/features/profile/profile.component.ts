import {Component, inject, OnInit} from '@angular/core';
import {ProfileService} from './profile.service';
import {FormsModule} from '@angular/forms';
import {Profile} from './profile';
import {Router} from '@angular/router';

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
  router = inject(Router)

  profile!: Profile;
  oldUsername!: string;

  ngOnInit() {
    this.profileService.getProfile()
      .subscribe(value => {
        this.profile = value
        this.oldUsername = value.username
      })
  }

  onClickUpdate(){
    this.profileService.updateProfile(this.oldUsername, this.profile)
      .subscribe({
        next: value => {
          this.profile = value
          this.oldUsername = value.username
        },
        error: err => {
          console.error('Update profile failed!', err)
        }
      })
  }

  onClickDeleteProfile(){
    this.router.navigate([`delete-profile`])
  }

  onClickUpdatePassword(){
    this.router.navigate([`update-password`])
  }
}
