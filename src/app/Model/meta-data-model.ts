import { DailyWeatherModel } from './daily-weather-model';
import { WeatherModel } from './weather-model';
export interface MetaDataModel {

  DataAmount:number;
  DataCollectedTime: number;
  RamUsage: number;
  CPUUsage:number;
  Dailyweather?: WeatherModel[];


}

