import { InputModel } from './../Model/input-model';
import { Injectable } from '@angular/core';
import { ApiHandlerService } from './api-handler.service';
import { DailyWeatherModel } from '../Model/daily-weather-model';

@Injectable({
  providedIn: 'root'
})
export class RepositoryHandlerService {
  weatherDate: DailyWeatherModel[];

  constructor(private api:ApiHandlerService) { }

  public async getWeatherData(inputData: InputModel): Promise<void> {
    try {
      const response: any = await this.api.GetWeatherData(inputData);
      return response;
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }


}
