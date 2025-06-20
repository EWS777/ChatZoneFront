import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-filter',
  imports: [
    RouterOutlet
  ],
  templateUrl: './filter.component.html',
  standalone: true,
  styleUrl: './filter.component.css'
})
export class FilterComponent {

}
