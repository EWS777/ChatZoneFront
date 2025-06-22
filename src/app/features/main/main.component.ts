import {Component, inject, OnInit} from '@angular/core';
import {ProfileService} from '../profile/profile.service';
import {Router} from '@angular/router';
import {AuthorizationService} from '../authorization/authorization.service';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  router = inject(Router)
  authService = inject(AuthorizationService)
  profile = inject(ProfileService)

  username: string | null = null;


  ngOnInit(){
    // this.profile.getProfile('ews777')
    //   .subscribe({
    //     next: value => {
    //       console.log(value)
    //       this.username = value.username
    //     }
    //   })
  }

  onClickLogin(){
    this.router.navigate(['login'])
  }

  onClickProfile(){
    this.router.navigate([`profile`])
  }

  onClickLogout(){
    this.authService.logout().subscribe({
      next: () =>{
        this.router.navigate([''])
      },
      error: ()=>{
        this.authService.clearAuth()
        this.router.navigate([''])
      }
    })
  }
}
