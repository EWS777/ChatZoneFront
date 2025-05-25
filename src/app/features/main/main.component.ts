import {Component, inject, OnInit} from '@angular/core';
import {ProfileService} from '../profile/profile.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  router = inject(Router)

  profile = inject(ProfileService)

  username: string | null = null;


  ngOnInit(){
    this.profile.getProfile('ews777')
      .subscribe({
        next: value => {
          console.log(value)
          this.username = value.Username
        }
      })
  }

  onClickLogin(){
    this.router.navigate(['login'])
  }

  onClickProfile(){
    this.router.navigate([`profile/${this.username}`])
  }
}
