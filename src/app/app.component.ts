import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthorizationService} from './features/authorization/authorization.service';

@Component({
  selector: 'app-root',
  standalone: true, //?
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'ChatZoneFront';

  constructor(private authService: AuthorizationService) {}

  ngOnInit(): void {
    this.authService.checkAuth().subscribe();
  }
}
