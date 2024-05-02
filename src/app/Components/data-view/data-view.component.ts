import { WeatherModel } from './../../Model/weather-model';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CardElementComponent } from '../card-element/card-element.component';
import { ListElementComponent } from '../list-element/list-element.component';
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
  totalDataPoints: number = 0;

  @ViewChild('uiElement', { static: false }) public element: ElementRef;

  @Input() cardviewToogle: boolean;
  constructor(private repoService: RepositoryHandlerService) {}

  ngOnInit(): void {



    //subscribe to cleanup
    this.repoService.CleanupMethodObservable$.subscribe(() => {
      this.clearData();
    });


    //this.generateDummyData(100);
    this.repoService.subcribeToweatherData().subscribe((data) => {
      if (data != null) {
        this.SetTotalDataPoints();
        if (this.weatherDateCollection == null) {
          this.weatherDateCollection = data;
        } else {
          this.weatherDateCollection.Dailyweather = [
            ...this.weatherDateCollection.Dailyweather,
            ...data.Dailyweather,
          ];

          this.RemoveOldData();
          console.log(
            'total datapoints: ',
            this.weatherDateCollection.Dailyweather.length,
            'of: ',
            this.totalDataPoints
          );
        }
      }
    });
  }

  //creates dummy data for testing purposes
  generateDummyData(numItems: number) {
    const weatherArray: WeatherModel[] = [];

    for (let i = 0; i < numItems; i++) {
      const weatherData: WeatherModel = {
        Temperature: +(Math.random() * 30).toFixed(2),
        Rain: +(Math.random() * 10).toFixed(2),
        WindSpeed: +(Math.random() * 20).toFixed(2),
        WindDirection: +(Math.random() * 360).toFixed(2),
        WindGusts: +(Math.random() * 30).toFixed(2),
        SunElevationAngle: +(Math.random() * 90).toFixed(2),
        SunAzimuthAngle: +(Math.random() * 360).toFixed(2),
        GTI: +(Math.random() * 500).toFixed(2),
        RelativeHumidity: +(Math.random() * 100).toFixed(2),
        DateandTime: new Date().toString(),
        Address: 'Vejrvænget 24, 12345 vejby',
        Latitude: '54.91883827',
        Longitude: '09.89751434',
      };

      weatherArray.push(weatherData);
    }

    const metaData: MetaDataModel = {
      CPUUsage: 98,
      RamUsage: '5000 mb',
      DataAmount: '1500 mb',
      DataCollectedTime: '200 ms',
      Dailyweather: weatherArray,
      ConvertionCpuUsage: 100,
      ConvertionRamUsage: '200 mb',
      ConvertionTimer: '1 ms',
    };
    this.weatherDateCollection = metaData;
  }

  //get weatherdata within a chunk
  fetchData(fromIndex: number, toIndex: number) {
    if (fromIndex > 0) {
      this.repoService.getLocations(fromIndex, toIndex).subscribe({
        next: (locations) => {
          this.repoService.getWeatherData(
            this.repoService.returnUserInput(locations)
          );
        },

        error: (error) => console.log(error),
      });
    }
  }

  //lazy load new data when scrolling
  public OnScroll() {
    const element = this.element.nativeElement;
    const totalScrolled =
      Math.round(element.clientHeight + element.scrollTop) + 1;
    const scrollHeight = Math.round(element.scrollHeight);

    if (
      totalScrolled === scrollHeight &&
      this.weatherDateCollection.Dailyweather.length < this.totalDataPoints
    ) {
      this.fetchData(this.fromIndex, this.toIndex);
      this.fromIndex += this.repoService.ChunkAmount;
      this.toIndex = this.fromIndex + this.repoService.ChunkAmount - 1;
    }
  }

  //set total data being lazy loaded
  SetTotalDataPoints() {
    if (this.totalDataPoints == 0) {
      this.repoService.getTotalLocations().subscribe((value: number) => {
        this.totalDataPoints = value;
        this.fromIndex = this.repoService.ChunkAmount + 1;
        this.toIndex = this.fromIndex + this.repoService.ChunkAmount - 1;
      });
    }
  }

  //remove old data when lazy loading
  RemoveOldData() {
    if (this.weatherDateCollection.Dailyweather != null) {
      if (this.weatherDateCollection.Dailyweather.length > 5000) {
        console.log('removing data');
        this.weatherDateCollection.Dailyweather.splice(0, 1000);
      }
    }
  }

  //clear view of data
  clearData() {
    if (this.weatherDateCollection != null) {
      if (this.weatherDateCollection.Dailyweather == null) {
        return;
      }

      if (this.weatherDateCollection.Dailyweather.length > 0) {
        this.weatherDateCollection.Dailyweather = [];
        this.weatherDateCollection.CPUUsage = 0;
        this.weatherDateCollection.DataAmount = '';
        this.weatherDateCollection.DataCollectedTime = '';
        this.weatherDateCollection.RamUsage = '';
        this.fromIndex = 0;
        this.toIndex = 0;
        this.totalDataPoints = 0;
      }
    }
  }
}
