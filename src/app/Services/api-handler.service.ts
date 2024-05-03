import { Injectable, Input } from '@angular/core';
import { InputModel } from '../Model/input-model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {

 private apiUrl = 'https//dvf-api.weblion.dk';
  constructor(private http: HttpClient,private datePipe: DatePipe) {}

  //calls the api which returns the total number of locations in the database
  getLocationCount(): Observable<any> {
    try {

      const url = "https://dvf-api.weblion.dk/GetLocationCount";

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
    console.log(parameters);
    const apirurl = "https://dvf-api.weblion.dk";
    return this.http.post<any>(`${apirurl}/GetWeatherData`, parameters);
  }

  //calls the api to delete weather data from the database and file server
  public DeleteWeather(deleteDate: string): Observable<any> {
    try {

      const testDate = "2023-01-01";
      const formattedDateString = `"${testDate}"`;

      this.datePipe.transform(deleteDate, 'yyyy-MM-dd');

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

    console.log("my date: " + testDate); // Log the formatted date string
      const apiUrl = "https://dvf-api.weblion.dk";
      return this.http.post<any>(
        `${apiUrl}/DeleteData`, JSON.stringify(deleteDate),{ headers: headers });
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }

  //calls the api to restore all data from the database and file server
  public RestoreData() {
    try {
      const apiUrl = "https://dvf-api.weblion.dk";
      return this.http.post<any>(`${apiUrl}/RestoreData`, null);
    } catch (error) {
      console.error('Error restoring weather data:', error);
    }
  }

  //calls the api to return a number of locations based on their id number in the database
  public GetLocations(fromIndex: number, toIndex: number): Observable<any> {
    try {

      let fromindex = fromIndex.toString();
      let toindex = toIndex.toString();
      const apiUrl = "https://dvf-api.weblion.dk";
      const apiUrlWithParams = apiUrl + "/GetLocations?toIndex=" + toindex +"&fromIndex=" + fromindex;

      return this.http.post<any>(`${apiUrlWithParams}`,null);
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }

  //calls the api to return a list of addresses based on a partial typed address
  public GetAdress(input:string): Observable<any> {

    try {

      const apiUrl = "https://dvf-api.weblion.dk";
      const apiUrlWithParams = apiUrl + "/GetAddress?addressInput=" + input;


      return this.http.post<any>(apiUrlWithParams,null );
    } catch (error) {
      console.error('Error deleting weather data:', error);
    }
  }
}
