import { LocationModel } from './../Model/location-model';
import { DailyWeatherModel } from './../Model/daily-weather-model';
import { WeatherModel } from './../Model/weather-model';
import { InputModel } from './../Model/input-model';
import { Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';

import { BehaviorSubject, Observable } from 'rxjs';
import { MetaDataModel } from '../Model/meta-data-model';


@Injectable({
  providedIn: 'root',
})
export class RepositoryHandlerService {
  weatherDate: DailyWeatherModel[];
  info$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public loadedData$: BehaviorSubject<DailyWeatherModel[]> = new BehaviorSubject<DailyWeatherModel[]>([]);

  constructor(private api: ApiHandlerService) {}

  public getAllweatherData(
    locations: string[],
    fromDate: string,
    toDate: string
  ): Observable<any> {
    console.log('getting all weather data');
    try {
      console.log('to date: ', toDate, 'from date: ', fromDate);

      const response: any = this.api.getAllWeatherData(
        locations,
        fromDate,
        toDate
      );

      // const dailyWeatherArray: DailyWeatherModel[] = response.dailyWeather.map((item: any) => ({
      //   WeatherData: item.weatherData as WeatherModel,
      //   Locations: item.locations as LocationModel
      // }));

      return response;
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  subcribeToweatherData():Observable<DailyWeatherModel[]>
  {
    console.log("emiting");
    return this.loadedData$.asObservable();
  }

  public getWeatherData(inputData: InputModel) {
    try {
      this.api.GetWeatherData(inputData).subscribe({
        next: (data) => {
          // Map each item in the received data array to the corresponding models
          const mappedData = data.map((item: any) => {


            const data = item.weatherData.map((weatherInfo) =>{

              console.log("inside method: ",weatherInfo)

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
                TimeOfDay: weatherInfo.dateAndTime // Assuming you want to use DateAndTime as TimeOfDay
              };
              return weatherData;
            })

            const firstElement = item.weatherData[0];
            // console.log("weatherdata: " ,data);


            const location: LocationModel = {
              Longitude: firstElement.longitude,
              Laditude: firstElement.latitude,
              Address: firstElement.address,

            };
            console.log("first element: ",data);
           const dailyweatherData: DailyWeatherModel ={
            Locations: location,
            WeatherData: data as WeatherModel[]
           };

            return dailyweatherData;
          });

          // Emit the mapped data to subscribers
          this.loadedData$.next(mappedData);

      }});
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  deleteResource(toDate: Date) {
    this.api.DeleteWeather(toDate).subscribe({
      next: (response) => {
        if (response.status >= 200) {
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
        if (response.status >= 200) {
          this.info$.next('data successfuldt genoprettet');
        }
      },
      error: (error) => {
        // console.log('my error: ', error);
        this.info$.next('error 404');
      },
    });
  }

  getDummyLocations(fromIndex: number, toIndex: number): Observable<any> {
    console.log('calling');
    return this.api.GetLocations(fromIndex, toIndex);
  }

  public async getLocations(
    fromIndex: number,
    toIndex: number
  ): Promise<Map<number, any>> {
    return new Promise<Map<number, any>>((resolve, reject) => {
      this.api.GetLocations(fromIndex, toIndex).subscribe({
        next: (response) => {
          if (response.status >= 200 && response.status < 300) {
            // Assuming response.body is the JSON array returned by the API
            const jsonArray = response.body;

            // Create a map to store the data points
            const dataMap = new Map<any, any>();
            console.log(dataMap);
            // Iterate over the JSON array and populate the map
            // let iterator:number;
            // jsonArray.forEach((dataPoint: any) => {
            //   // Assuming each data point has a unique identifier called 'id'
            //   dataMap.set(iterator, dataPoint);
            //   iterator++;
            // });

            resolve(dataMap);
          } else {
            reject(new Error('Failed to fetch data from the API'));
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
