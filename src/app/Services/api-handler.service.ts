import { Injectable } from '@angular/core';
import { InputModel } from '../Model/input-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService {

  constructor() { }

  public GetWeatherData(inputData:InputModel): Observable<any>
  {
    //todo get method to call api endpoint for data
    return
  }
}
