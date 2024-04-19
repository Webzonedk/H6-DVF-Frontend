import { DailyWeatherModel } from './../../Model/daily-weather-model';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputModel } from '../../Model/input-model';
import { CommonModule, NgIf, formatDate } from '@angular/common';
import { RepositoryHandlerService } from '../../Services/repository-handler.service';
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
  VisualToggle: boolean = false;
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
      FromDate: [new Date().toISOString().substring(0,10)],
      ToDate: [new Date().toISOString().substring(0,10)],
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
    const formData: InputModel = this.inputForm.value;
    const fromDate =this.inputForm.get('FromDate').value;
    const toDate =this.inputForm.get('ToDate').value;
    // console.log("from date: ",fromDate, "todate: " ,toDate);
    // console.log('Form data:', val.TodDate);
   // console.log('ToDate control value:', this.inputForm.get('ToDate').value);
    //get all data if address is empty
    if (formData.Address == '') {
      this.repository.getDummyLocations(0, 10).subscribe({
        next: (locations) =>
          this.repository.getAllweatherData(
            locations,
            fromDate,
            toDate
          ),
      });
    }
    else
    {
      this.repository.getWeatherData(formData);
    }



  }

  DeleteWeatherData() {
    const formData: Date = this.deleteForm.value;
    this.repository.deleteResource(formData);
    // console.log('Form data:', formData);
  }

  RestoreData() {
    // console.log('restoring data');
    this.repository.restoreData();
  }

  toggleButton(isDataButton: boolean) {
    console.log(this.Maintainage);
    this.Maintainage = !isDataButton;
  }

  visualToggleChange() {
    console.log(this.VisualToggle);
    this.VisualToggle = !this.VisualToggle;
  }

  lazyLoadToggleChange() {
    this.LazyloadToggle = !this.LazyloadToggle;
    console.log(this.LazyloadToggle);
  }
}
