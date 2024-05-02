import { Component, Input } from '@angular/core';
import { WeatherModel } from '../../Model/weather-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-element.component.html',
  styleUrl: './card-element.component.css',
})
export class CardElementComponent {
  @Input() dataSource: WeatherModel;
}
