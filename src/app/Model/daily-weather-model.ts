import { LocationModel } from './location-model';
import { WeatherModel } from './weather-model';

export interface DailyWeatherModel {
  WeatherData: WeatherModel;
  Locations: LocationModel;
}
