import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar-menu',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar-menu.component.html',
  styleUrl: './nav-bar-menu.component.css'
})
export class NavBarMenuComponent {
  tempData: number = 1500
  currentDate: string;

  constructor()
  {
    this.currentDate = new Date().toISOString().split('T')[0];
  }
}
