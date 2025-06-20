import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-quick-messages',
  imports: [
    RouterOutlet
  ],
  templateUrl: './quick-messages.component.html',
  standalone: true,
  styleUrl: './quick-messages.component.css'
})
export class QuickMessagesComponent {

}
