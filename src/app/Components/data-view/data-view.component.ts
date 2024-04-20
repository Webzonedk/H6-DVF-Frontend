import { WeatherModel } from './../../Model/weather-model';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CardElementComponent } from '../card-element/card-element.component';
import { ListElementComponent } from '../list-element/list-element.component';
import { DailyWeatherModel } from '../../Model/daily-weather-model';
import { LocationModel } from '../../Model/location-model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RepositoryHandlerService } from '../../Services/repository-handler.service';
import { MetaDataModel } from '../../Model/meta-data-model';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [CardElementComponent, ListElementComponent, NgFor, NgIf],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.css',
})
export class DataViewComponent {
  weatherDateCollection: MetaDataModel;
  fromIndex: number;
  toIndex: number;
  totalDataPoints;
  @ViewChild('uiElement', { static: false }) public element: ElementRef;

  @Input() cardviewToogle: boolean;
  constructor(private repoService: RepositoryHandlerService) {}

  ngOnInit(): void {
    //subscribe to test
    this.repoService.CleanupMethodObservable$.subscribe(() => {
      this.clearData();
    });

    this.fetchData(this.fromIndex, this.toIndex);

    this.repoService.subcribeToweatherData().subscribe((data) => {
      if (data != null) {
        if (this.weatherDateCollection == null) {
          this.weatherDateCollection = data;
          this.repoService.getTotalLocations().subscribe((value: number) => {
            this.totalDataPoints = value;
          });
          this.fromIndex = this.repoService.ChunkAmount + 1;
          this.toIndex = this.fromIndex + this.repoService.ChunkAmount - 1;

          console.log(
            'first data: ',
            this.totalDataPoints,
            ' fromIndex: ',
            this.fromIndex,
            ' toIndex: ',
            this.toIndex,
            'chunk amount: ',
            this.repoService.ChunkAmount
          );
        } else {
          this.weatherDateCollection.Dailyweather = [
            ...this.weatherDateCollection.Dailyweather,
            ...data.Dailyweather,
          ];

          console.log('added data ', this.fromIndex);
          console.log(
            'second data: ',
            this.totalDataPoints,
            ' fromIndex: ',
            this.fromIndex,
            ' toIndex: ',
            this.toIndex
          );
        }
      } else {
      }
    });
  }

  generateDummyData() {
    // this.weatherDateCollection = [];
    const location: LocationModel = {
      Longitude: 123.456, // Sample longitude
      Latitude: 789.012, // Sample latitude
    };

    const weatherArray: WeatherModel[] = [
      {
        Temperature: 16.5, // Sample temperature
        Rain: 2.1, // Sample rain
        WindSpeed: 6.5, // Sample wind speed
        WindDirection: 180, // Sample wind direction
        WindGusts: 10.6, // Sample wind gusts
        SunElevationAngle: 45, // Sample sun elevation angle
        SunAzimuthAngle: 120, // Sample sun azimuth angle
        GTI: 122.8, // Sample GTI
        RelativeHumidity: 60, // Sample relative humidity
        DateandTime: new Date().toString(), // Current date and time
        Address: 'Vejrvænget 24, 12345 vejby',
        Latitude: 95,
        Longitude: 35,
      },
    ];

    const dailyWeather: DailyWeatherModel = {
      Locations: location,
      WeatherData: weatherArray,
    };

    const metaData: MetaDataModel = {
      CPUUsage: 98,
      RamUsage: 5000,
      DataAmount: 1500,
      DataCollectedTime: 200,
      Dailyweather: weatherArray,
    };
    this.weatherDateCollection = metaData;
    // const numberOfEntries = 1; // Number of dummy entries
    // for (let i = 0; i < numberOfEntries; i++) {
    //   this.weatherDateCollection.push(metaData);
    // }

    //console.log(this.weatherDateCollection);
  }

  fetchData(fromIndex: number, toIndex: number) {
    if (fromIndex > 0) {
      this.repoService.getLocations(fromIndex, toIndex).subscribe({
        next: (locations) => {
          this.repoService.getWeatherData(
            this.repoService.returnUserInput(locations)
          );
          console.log('getting data');
          // this.weatherDateCollection.Dailyweather = [...this.weatherDateCollection.Dailyweather,...response.Dailyweather];
        },

        error: (error) => console.log(error),
      });
    }
  }

  public OnScroll() {
    // console.log("i am scrolling");
    //keep going until finished

    const element = this.element.nativeElement;
    const totalScrolled =
      Math.round(element.clientHeight + element.scrollTop) + 1;
    const scrollHeight = Math.round(element.scrollHeight);

    // console.log(
    //   'clientHeight: ',
    //   totalScrolled,
    //   'scrollHeight:',
    //   scrollHeight,
    //   'weatherLength: ',
    //   this.weatherDateCollection.Dailyweather.length,
    //   'total: ',
    //   this.totalDataPoints
    // );
    if (
      totalScrolled === scrollHeight &&
      this.weatherDateCollection.Dailyweather.length < this.totalDataPoints
    ) {
      console.log('this wroks', this.fromIndex);
      this.fetchData(this.fromIndex, this.toIndex);
      this.fromIndex += this.repoService.ChunkAmount;
      this.toIndex = this.fromIndex + this.repoService.ChunkAmount - 1;
    }
  }

  clearData() {

    if(this.weatherDateCollection != null)
      {
        if (this.weatherDateCollection.Dailyweather.length > 0) {
          this.weatherDateCollection.Dailyweather = [];
          this.weatherDateCollection.CPUUsage = 0;
          this.weatherDateCollection.DataAmount = 0;
          this.weatherDateCollection.DataCollectedTime = 0;
          this.weatherDateCollection.RamUsage = 0;
          this.fromIndex =0;
          this.toIndex = 0;
          this.totalDataPoints =0;
        }
      }

  }
}
