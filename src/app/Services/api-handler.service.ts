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

  constructor(private http: HttpClient) {}

  public GetWeatherData(inputData: InputModel): Observable<any> {

    let myheaders = new HttpHeaders();
    myheaders.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params.set('address', inputData.Address);
    params.set('dataSource', inputData.DataSource);
    params.set('fromDate', inputData.FromDate.toJSON());
    params.set('toDate', inputData.Todate.toJSON());


    return this.http.get<any>(`${this.url}/WeatherData/GetWeatherData`, {
      headers: myheaders,
      params: params,
    });
  }

  public DeleteWeather(deleteDate:Date): Observable<any>
  {
    try {

      return this.http.post<any>('${this.url}/Maintenance/DeleteData',deleteDate);
    } catch (error) {
      console.error("Error deleting weather data:" ,error);
    }
  }

  public RestoreData()
  {
    try {
      return this.http.post<any>('${this.url}/Maintenance/RestoreData',{});
    } catch (error) {
      console.error("Error restoring weather data:" ,error);
    }
  }
}
