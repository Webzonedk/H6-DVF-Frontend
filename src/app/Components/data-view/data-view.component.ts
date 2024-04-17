import { Component, Input } from '@angular/core';
import { CardElementComponent } from '../card-element/card-element.component';
import { ListElementComponent } from '../list-element/list-element.component';
import { DailyWeatherModel } from '../../Model/daily-weather-model';
import { LocationModel } from '../../Model/location-model';
import { WeatherModel } from '../../Model/weather-model';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [CardElementComponent, ListElementComponent, NgFor, NgIf],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.css',
})
export class DataViewComponent {
  tempData: DailyWeatherModel[];
  tempData2: string[] = ['test1', 'test2'];
  @Input() cardviewToogle: boolean;
  constructor() {
    this.tempData = [];
    const location: LocationModel = {
      Longitude: 123.456, // Sample longitude
      Laditude: 789.012, // Sample latitude
      Address: 'Vejrvænget 24',
      ZipCode: 12345,
      City: 'Vejby',
    };

    const weather: WeatherModel = {
      Temperature: 16.5, // Sample temperature
      Rain: 2.1, // Sample rain
      WindSpeed: 6.5, // Sample wind speed
      WindDirection: 180, // Sample wind direction
      WindGusts: 10.6, // Sample wind gusts
      SunElevationAngle: 45, // Sample sun elevation angle
      SunAzimuthAngle: 120, // Sample sun azimuth angle
      GTI: 122.8, // Sample GTI
      RelativeHumidity: 60, // Sample relative humidity
      TimeOfDay: new Date(), // Current date and time
    };

    const numberOfEntries = 48; // Number of dummy entries
    for (let i = 0; i < numberOfEntries; i++) {
      this.tempData.push({
        WeatherData: weather,
        Locations: location,
      });
    }

    console.log(this.tempData[0]);
  }
}
