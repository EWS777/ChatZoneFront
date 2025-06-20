import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-blocked-users',
    imports: [
        RouterOutlet
    ],
  templateUrl: './blocked-users.component.html',
  standalone: true,
  styleUrl: './blocked-users.component.css'
})
export class BlockedUsersComponent {

}
