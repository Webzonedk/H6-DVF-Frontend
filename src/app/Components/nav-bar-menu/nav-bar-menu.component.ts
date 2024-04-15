import { DailyWeatherModel } from './../../Model/daily-weather-model';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputModel } from '../../Model/input-model';
import { CommonModule } from '@angular/common';
import { RepositoryHandlerService } from '../../Services/repository-handler.service';


@Component({
  selector: 'app-nav-bar-menu',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './nav-bar-menu.component.html',
  styleUrl: './nav-bar-menu.component.css',
})
export class NavBarMenuComponent {
  tempData: number = 1500;
  currentDate: string;
  Maintainage: boolean = false;
  inputForm: FormGroup;
  deleteForm: FormGroup;
  weatherDate: DailyWeatherModel[];

  constructor(private fb: FormBuilder, private repository:RepositoryHandlerService) {

  }

  ngOnInit(): void {
    // Initialize the form group based on the InputModel interface
    this.inputForm = this.fb.group({
      Address: [''],
      FromDate: [new Date()],
      ToDate: [new Date()],
      DataSource: [false],
    });

    this.deleteForm = this.fb.group({
      deleteDate: [new Date()]
    });
  }



  GetWeatherData() {

     const formData: InputModel = this.inputForm.value;

     console.log('Form data:', formData);
  }

  DeleteWeatherData()
  {
    const formData: Date = this.deleteForm.value;
    console.log('Form data:', formData);
  }

  RestoreData()
  {
    console.log("restoring data");
  }

  toggleButton(isDataButton: boolean) {
    this.Maintainage = !isDataButton;
    console.log(this.Maintainage);
  }
}
