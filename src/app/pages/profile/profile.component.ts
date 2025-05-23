import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  username: string | null = null;

  http = inject(HttpClient)
  url = 'https://localhost:7212/'

  profile(){
    return this.http.get(`${this.url}/${this.username}`, {
      withCredentials: true
    })
  }
}
