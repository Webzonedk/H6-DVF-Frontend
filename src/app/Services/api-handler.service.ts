import { Injectable } from '@angular/core';
import { InputModel } from '../Model/input-model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DailyWeatherModel } from '../Model/daily-weather-model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {
  url: string = 'https//api.weblion.dk/';
  dummyUrl: string = 'https://localhost:7121/WeatherForecast';
  constructor(private http: HttpClient) {}

  getAllWeatherData(coordinates: string[],toDate_: string,fromDate_: string): Observable<any> {
    try {
      console.log("my date: ",toDate_);
      // let myheaders = new HttpHeaders();
      // myheaders.append('Content-Type', 'application/json');
      let myparams = new HttpParams();
     myparams = myparams.set('fromDate', fromDate_);
     myparams =  myparams.set('toDate', toDate_);
      // params = params.appendAll({'coordinates':coordinates});
      // params.append('coordinates',coordinates.join(','));
      // myparams = myparams.append('coordinates',JSON.stringify(coordinates));
      // myparams = myparams.append('fromDate',JSON.stringify(fromDate_));
      console.log(`${this.dummyUrl}/weatherData/GetAllWeatherData?${myparams}`);
const url =`${this.dummyUrl}/weatherData/GetAllWeatherData?${myparams}`;
      // .set('coordinates', coordinates.join(','));

      return this.http.get<any>(url);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error; // rethrow the error to be caught by the caller
    }
  }

  public GetWeatherData(inputData: InputModel): Observable<any> {
    console.log(inputData);
    let myheaders = new HttpHeaders();
    myheaders.append('Content-Type', 'application/json');
    // let myparams = new HttpParams();
    // myparams = myparams.append('address', inputData.Address);
    // myparams = myparams.append('dataSource', inputData.DataSource);
    // myparams = myparams.append('fromDate', inputData.FromDate);
    // myparams = myparams.append('toDate', inputData.TodDate);

    const parameters = {address: inputData.Address,dataSource: inputData.DataSource,fromDate:inputData.FromDate,toDate: inputData.TodDate};
    //params: parameters
    console.log(`${this.dummyUrl}/weatherData/GetWeatherData`);
    console.log('https://localhost:7121/WeatherForecast/weatherData/GetWeatherData',{params: parameters});

    return this.http.get<any>(`${this.dummyUrl}/weatherData/GetWeatherData`);
  }

  public DeleteWeather(deleteDate: Date): Observable<any> {
    try {
      return this.http.post<any>(
        `${this.url}/Maintenance/DeleteData`,
        deleteDate
      );
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }

  public RestoreData() {
    try {
      return this.http.post<any>(`${this.url}/Maintenance/RestoreData`, {});
    } catch (error) {
      console.error('Error restoring weather data:', error);
    }
  }

  public GetLocations(fromIndex: number, toIndex: number): Observable<any> {
    try {
      const data = { fromIndex: fromIndex, toIndex: toIndex };
      return this.http.get<any>(`${this.dummyUrl}/Maintenance/Locations`, {
        params: data,
      });
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }

  public GetLocationCount(): Observable<any> {
    try {
      return this.http.get<any>(
        `${this.dummyUrl}/Maintenance/GetLocationCount`
      );
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }
}
