import { Injectable, Input } from '@angular/core';
import { InputModel } from '../Model/input-model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {
  private apiUrl: string = 'https://dvf-api.weblion.dk';
  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  //calls the api which returns the total number of locations in the database
  getLocationCount(): Observable<any> {
    try {



      return this.http.get<any>(`${this.apiUrl}/GetLocationCount`);
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


    return this.http.post<any>(`${this.apiUrl}/GetWeatherData`, parameters);
  }

  //calls the api to delete weather data from the database and file server
  public DeleteWeather(deleteDate: string): Observable<any> {
    try {


      this.datePipe.transform(deleteDate, 'yyyy-MM-dd');

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });


      return this.http.post<any>(
        `${this.apiUrl}/DeleteData`,
        JSON.stringify(deleteDate),
        { headers: headers }
      );
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }

  //calls the api to restore all data from the database and file server
  public RestoreData() {
    try {

      return this.http.post<any>(`${this.apiUrl}/RestoreData`, null);
    } catch (error) {
      console.error('Error restoring weather data:', error);
    }
  }

  //calls the api to return a number of locations based on their id number in the database
  public GetLocations(fromIndex: number, toIndex: number): Observable<any> {
    try {
      let fromindex = fromIndex.toString();
      let toindex = toIndex.toString();

      const apiUrlWithParams =
        this.apiUrl + '/GetLocations?toIndex=' + toindex + '&fromIndex=' + fromindex;

      return this.http.post<any>(`${apiUrlWithParams}`, null);
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }

  //calls the api to return a list of addresses based on a partial typed address
  public GetAdress(input: string): Observable<any> {
    try {

      const apiUrlWithParams = this.apiUrl + '/GetAddress?addressInput=' + input;

      return this.http.post<any>(apiUrlWithParams, null);
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }
}
