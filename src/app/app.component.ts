import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthorizationComponent} from './features/authorization/authorization.component';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, //?
  imports: [RouterOutlet, AuthorizationComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ChatZoneFront';
}
