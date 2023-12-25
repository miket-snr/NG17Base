import { Component } from '@angular/core';
import { HelptextComponent } from '../helptext/helptext.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HelptextComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
