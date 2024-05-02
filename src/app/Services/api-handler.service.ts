import { Injectable } from '@angular/core';
import { InputModel } from '../Model/input-model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {

  url: string = 'https//dvf-api.weblion.dk/';
  constructor(private http: HttpClient) {}

  //calls the api which returns the total number of locations in the database
  getLocationCount(): Observable<any> {
    try {
      const url = `${this.url}/weatherData/GetLocationCount?`;

      return this.http.get<any>(url);
    } catch (error) {
      console.error('Error fetching location count:', error);
      throw error;
    }
  }

  //calls the api to return weather data based on search criteria
  public GetWeatherData(inputData: InputModel): Observable<any> {

    let myheaders = new HttpHeaders();
    myheaders.append('Content-Type', 'application/json');

    const parameters = {
      coordinates: inputData.Coordinates,
      ToggleDB: inputData.DataSource,
      FromDate: inputData.FromDate,
      ToDate: inputData.TodDate,
    };

    return this.http.get<any>(`${this.url}/weatherData/GetWeatherData`, {
      params: parameters,
    });
  }

  //calls the api to delete weather data from the database and file server
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

  //calls the api to restore all data from the database and file server
  public RestoreData() {
    try {
      return this.http.post<any>(`${this.url}/Maintenance/RestoreData`, {});
    } catch (error) {
      console.error('Error restoring weather data:', error);
    }
  }

  //calls the api to return a number of locations based on their id number in the database
  public GetLocations(fromIndex: number, toIndex: number): Observable<any> {
    try {
      const data = { fromIndex: fromIndex, toIndex: toIndex };
      return this.http.get<any>(`${this.url}/Maintenance/Locations`, {
        params: data,
      });
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }

  //calls the api to return a list of addresses based on a partial typed address
  public GetAdress(input:string): Observable<any> {
    try {
      const data = {addressInput: input};
      return this.http.get<any>(`${this.url}/Maintenance/GetAddress`,{params: data}
      );
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }
}
