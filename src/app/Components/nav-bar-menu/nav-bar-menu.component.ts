import { DailyWeatherModel } from './../../Model/daily-weather-model';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputModel } from '../../Model/input-model';
import { CommonModule, NgIf } from '@angular/common';
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
  VisualToggle: boolean = true;
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
    this.inputForm = this.fb.group({
      Address: [''],
      FromDate: [new Date()],
      ToDate: [new Date()],
      DataSource: [false],
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
    this.repository.getWeatherData(formData);
    console.log('Form data:', formData);
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
}
