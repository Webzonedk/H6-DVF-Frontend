import { NavBarMenuComponent } from './Components/nav-bar-menu/nav-bar-menu.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavBarMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'



})
export class AppComponent {
  title = 'DVF-Frontend';
}


