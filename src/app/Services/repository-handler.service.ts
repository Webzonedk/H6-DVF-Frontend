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

  info$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public loadedData$: BehaviorSubject<MetaDataModel> = new BehaviorSubject<MetaDataModel>(null);
  private RunCleanupMethodSubject: Subject<void> = new Subject<void>();
  CleanupMethodObservable$: Observable<void> = this.RunCleanupMethodSubject.asObservable();
  ChunkAmount: number;
  userInput: InputModel;

  constructor(private api: ApiHandlerService) {}

  //return user input to view data component
  returnUserInput(newlocations: any) {
    this.userInput.Coordinates = newlocations;
    return this.userInput;
  }

  //method to subscribe to new data coming in from the api
  subcribeToweatherData(): Observable<MetaDataModel> {
    return this.loadedData$.asObservable();
  }

  //method triggers a cleanup of data in components subscribed to it
  RunCleanup() {
    this.RunCleanupMethodSubject.next();
  }

  //method calls the api service to get data from api. Returns a mapped model from json
  public getWeatherData(inputData: InputModel) {
    try {
      this.api.GetWeatherData(inputData).subscribe({
        next: (data) => {
          const data2 = data.weatherData.map((weatherInfo) => {
            const weatherData: WeatherModel = {
              Address: weatherInfo.address,
              Latitude: weatherInfo.latitude,
              Longitude: weatherInfo.longitude,
              Temperature: weatherInfo.temperature.toFixed(2),
              WindSpeed: weatherInfo.windSpeed.toFixed(2),
              WindDirection: weatherInfo.windDirection.toFixed(2),
              WindGusts: weatherInfo.windGusts.toFixed(2),
              RelativeHumidity: weatherInfo.relativeHumidity.toFixed(2),
              Rain: weatherInfo.rain.toFixed(2),
              SunElevationAngle: weatherInfo.sunElevationAngle.toFixed(2),
              SunAzimuthAngle: weatherInfo.sunAzimuthAngle.toFixed(2),
              GTI: weatherInfo.gti.toFixed(2),
              DateandTime: weatherInfo.dateAndTime, // Assuming you want to use DateAndTime as TimeOfDay
            };
            return weatherData;
          });

          const metaData: MetaDataModel = {
            DataCollectedTime: data.fetchDataTimer,
            DataAmount: data.dataLoadedMB,
            RamUsage: data.ramUsage,
            CPUUsage: data.cpuUsage.toFixed(2),
            ConvertionTimer: data.convertionTimer,
            ConvertionRamUsage: data.convertionRamUsage,
            ConvertionCpuUsage: data.convertionCpuUsage.toFixed(2),
            Dailyweather: data2,
          };


          // Emit the mapped data to subscribers
          this.loadedData$.next(metaData);
        },
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  //method calls api service to delete weather data until a specific date
  deleteData(toDate: Date) {
    this.api.DeleteWeather(toDate).subscribe({
      next: (response) => {

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

  //method calls the api service to restore weather data in files and database on server
  restoreData() {
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

  //method returns a list of locations based on id numbers
  getLocations(fromIndex: number, toIndex: number): Observable<any> {
    return this.api.GetLocations(fromIndex, toIndex);
  }

  //method returns total count of locations from the api
  getTotalLocations(): Observable<any> {
    return this.api.getLocationCount();
  }

  //method returns a list of addresses based on a partial typed address
  getAddresses(input: string): Observable<string[]> {
    return this.api.GetAdress(input);
  }
}
