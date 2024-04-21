import { Injectable, Input } from '@angular/core';
import { InputModel } from '../Model/input-model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {
  url: string = 'https//api.weblion.dk/';
  dummyUrl: string = 'https://localhost:7121/WeatherForecast';
  constructor(private http: HttpClient) {}

  getLocationCount(): Observable<any> {
    try {
      const url = `${this.dummyUrl}/weatherData/GetLocationCount?`;

      return this.http.get<any>(url);
    } catch (error) {
      console.error('Error fetching location count:', error);
      throw error;
    }
  }

  public GetWeatherData(inputData: InputModel): Observable<any> {
    //console.log('input: ', inputData);
    let myheaders = new HttpHeaders();
    myheaders.append('Content-Type', 'application/json');


    const parameters = {
      coordinates: inputData.Coordinates,
      ToggleDB: inputData.DataSource,
      FromDate: inputData.FromDate,
      ToDate: inputData.TodDate,
    };



    return this.http.get<any>(`${this.dummyUrl}/weatherData/GetWeatherData`, {
      params: parameters,
    });
  }

  public DeleteWeather(deleteDate: Date): Observable<any> {
    try {
      return this.http.post<any>(
        `${this.dummyUrl}/Maintenance/DeleteData`,
        deleteDate
      );
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }

  public RestoreData() {
    try {
      return this.http.post<any>(`${this.dummyUrl}/Maintenance/RestoreData`, {});
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

  public GetAdress(input:string): Observable<any> {
    try {
      const data = {addressInput: input};
      return this.http.get<any>(`${this.dummyUrl}/Maintenance/GetAddress`,{params: data}
      );
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }
}
