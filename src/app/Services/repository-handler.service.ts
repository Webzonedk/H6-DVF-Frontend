import { LocationModel } from './../Model/location-model';
import { DailyWeatherModel } from './../Model/daily-weather-model';
import { WeatherModel } from './../Model/weather-model';
import { InputModel } from './../Model/input-model';
import { Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MetaDataModel } from '../Model/meta-data-model';


@Injectable({
  providedIn: 'root',
})
export class RepositoryHandlerService {
  //weatherDate: DailyWeatherModel[];
  info$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public loadedData$: BehaviorSubject<MetaDataModel> = new BehaviorSubject<MetaDataModel>(null);
  private RunCleanupMethodSubject: Subject<void> = new Subject<void>();
  CleanupMethodObservable$: Observable<void> = this.RunCleanupMethodSubject.asObservable();
  ChunkAmount: number;
  userInput: InputModel;
  constructor(private api: ApiHandlerService) {}

  returnUserInput(newlocations: any)
  {
     this.userInput.Coordinates = newlocations;
    return this.userInput;
  }

  subcribeToweatherData():Observable<MetaDataModel>
  {

    return this.loadedData$.asObservable();
  }

  RunCleanup() {
    this.RunCleanupMethodSubject.next();
  }

  public getWeatherData(inputData: InputModel) {
    try {
      this.api.GetWeatherData(inputData).subscribe({
        next: (data) => {





            const data2 = data.weatherData.map((weatherInfo) =>{



              const weatherData: WeatherModel = {
                Temperature: weatherInfo.temperature,
                Rain: weatherInfo.rain,
                WindSpeed: weatherInfo.windSpeed,
                WindDirection: weatherInfo.windDirection,
                WindGusts: weatherInfo.windGusts,
                SunElevationAngle: weatherInfo.sunElevationAngle,
                SunAzimuthAngle: weatherInfo.sunAzimuthAngle,
                GTI: weatherInfo.gti,
                RelativeHumidity: weatherInfo.relativeHumidity,
                DateandTime: weatherInfo.dateAndTime, // Assuming you want to use DateAndTime as TimeOfDay
                Address: weatherInfo.address,
                Latitude: weatherInfo.latitude,
                Longitude: weatherInfo.longitude
              };
              return weatherData;
            })







           const metaData: MetaDataModel={
            DataAmount: data.dataAmount,
            DataCollectedTime: data.dataCollectedTime,
            RamUsage: data.ramUsage,
            CPUUsage: data.cpuUsage,
            Dailyweather: data2
           };



          console.log(metaData)
          // Emit the mapped data to subscribers
          this.loadedData$.next(metaData);

      }});
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  deleteData(toDate: Date) {
    this.api.DeleteWeather(toDate).subscribe({
      next: (response) => {
        console.log(response);
        if (response.statusCode >= 200) {
          this.info$.next('data successfuldt slettet');
        }
      },
      error: (error) => {
        // console.log('my error: ', error);
        this.info$.next('error 404');
      },
    });
  }

  restoreData() {
    const resourceId = 123;
    this.api.RestoreData().subscribe({
      next: (response) => {
        if (response.statusCode >= 200) {
          this.info$.next('data successfuldt genoprettet');
        }
      },
      error: (error) => {
        // console.log('my error: ', error);
        this.info$.next('error 404');
      },
    });
  }

  getLocations(fromIndex: number, toIndex: number): Observable<any> {
    console.log('calling');
    return this.api.GetLocations(fromIndex, toIndex);
  }

  getTotalLocations(): Observable<any>
  {
    return this.api.getLocationCount();
  }

}
