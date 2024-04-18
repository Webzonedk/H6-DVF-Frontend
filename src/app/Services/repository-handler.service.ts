import { InputModel } from './../Model/input-model';
import { Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { DailyWeatherModel } from '../Model/daily-weather-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepositoryHandlerService {
  weatherDate: DailyWeatherModel[];
  info$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private api: ApiHandlerService) {}

  public async getWeatherData(inputData: InputModel): Promise<void> {
    try {
      const response: any = await this.api.GetWeatherData(inputData);
      return response;
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  deleteResource(toDate: Date) {
    const resourceId = 123;
    this.api.DeleteWeather(toDate).subscribe({
      next: (response) => {

        if(response.status >= 200)
          {
            this.info$.next("data successfuldt slettet");
          }


      },
      error: (error) =>{
        // console.log('my error: ', error);
        this.info$.next("error 404");
      }
    });
  }

  restoreData() {
    const resourceId = 123;
    this.api.RestoreData().subscribe({
      next: (response) => {

        if(response.status >= 200)
          {
            this.info$.next("data successfuldt genoprettet");
          }


      },
      error: (error) =>{
        // console.log('my error: ', error);
        this.info$.next("error 404");
      }
    });
  }
}
