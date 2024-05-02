import { WeatherModel } from './weather-model';
export interface MetaDataModel {

  DataCollectedTime: string;
  DataAmount:string;
  RamUsage: string;
  CPUUsage:number;
  ConvertionTimer: string;
  ConvertionRamUsage: string;
  ConvertionCpuUsage: number;
  Dailyweather?: WeatherModel[];


}

