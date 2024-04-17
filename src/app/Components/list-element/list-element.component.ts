import { CommonModule } from '@angular/common';
import { LocationModel } from '../../Model/location-model';
import { WeatherModel } from './../../Model/weather-model';
import { Component, Input } from '@angular/core';



@Component({
  selector: 'app-list-element',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-element.component.html',
  styleUrl: './list-element.component.css'
})
export class ListElementComponent {
 @Input() dataSource: WeatherModel;
 @Input() locationSource: LocationModel;


}
