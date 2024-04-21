import { RepositoryHandlerService } from './../../Services/repository-handler.service';
import { InputModel } from './../../Model/input-model';
import { DailyWeatherModel } from './../../Model/daily-weather-model';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf, formatDate } from '@angular/common';

import { DataViewComponent } from '../data-view/data-view.component';

@Component({
  selector: 'app-nav-bar-menu',
  standalone: true,
  imports: [ReactiveFormsModule, DataViewComponent, NgIf],
  templateUrl: './nav-bar-menu.component.html',
  styleUrl: './nav-bar-menu.component.css',
})
export class NavBarMenuComponent {
  tempData: number = 1500;
  currentDate: string;
  Maintainage: boolean = false;
  VisualToggle: boolean = true;
  LazyloadToggle: boolean;
  inputForm: FormGroup;
  deleteForm: FormGroup;
  weatherDate: DailyWeatherModel[];
  infoFeedback: string;

  constructor(
    private fb: FormBuilder,
    private repository: RepositoryHandlerService
  ) {}

  ngOnInit(): void {
    // Initialize the form group based on the InputModel interface
    this.currentDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.inputForm = this.fb.group({
      Address: [''],
      FromDate: [new Date().toISOString().substring(0, 10)],
      ToDate: [new Date().toISOString().substring(0, 10)],
      DataSource: [false],
      numChunks: 5,
    });

    this.deleteForm = this.fb.group({
      deleteDate: [new Date()],
    });

    this.repository.info$.subscribe((message) => {
      this.infoFeedback = message;
    });
  }

  GetWeatherData() {


    const chunkSize = this.inputForm.get('numChunks').value;
    const input: InputModel = {
      FromDate: this.inputForm.get('FromDate').value,
      TodDate: this.inputForm.get('ToDate').value,
      Coordinates: this.inputForm.get('Address').value,
      DataSource: this.inputForm.get('DataSource').value,
    };

    if (input.Coordinates == '') {
      this.repository.RunCleanup();
      this.repository.getLocations(0, chunkSize).subscribe({
        next: (locations) => {
          input.Coordinates = locations;
          this.repository.ChunkAmount = chunkSize;
          this.repository.getWeatherData(input);
          this.repository.userInput = input;
        },
      });
    } else {
      this.repository.getWeatherData(input);
       this.repository.RunCleanup();
    }
  }

  DeleteWeatherData() {
    const formData: Date = this.deleteForm.value;
    this.repository.deleteData(formData);
    this.repository.RunCleanup();
  }

  RestoreData() {
    // console.log('restoring data');
    this.repository.restoreData();
    this.repository.RunCleanup();

  }

  toggleButton(isDataButton: boolean) {
   // console.log(this.Maintainage);
    this.Maintainage = !isDataButton;
    this.resetFedBack();
  }

  visualToggleChange() {

    this.VisualToggle = !this.VisualToggle;

  }

  lazyLoadToggleChange() {
    this.LazyloadToggle = !this.LazyloadToggle;
    //console.log(this.LazyloadToggle);
  }

  resetFedBack()
  {
    if(this.infoFeedback != "")
      {
        this.infoFeedback = "";
      }
  }
}
