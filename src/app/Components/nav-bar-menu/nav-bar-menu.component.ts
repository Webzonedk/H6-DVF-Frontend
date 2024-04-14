import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputModel } from '../../Model/input-model';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';


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
  Maintainage: boolean = true;
  inputForm: FormGroup; // Declare a FormGroup property

  constructor(private fb: FormBuilder, private datePipe:DatePipe) {
    //this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    // Initialize the form group based on the InputModel interface
    this.inputForm = this.fb.group({
      Address: [''], // Default value for Address
      FromDate: [new Date()], // Default value for FromDate
      ToDate: [new Date()], // Default value for Todate
      DataSource: [false], // Default value for DataSource
    });
  }



  GetWeatherData() {
   // console.log('this is a test');
     const formData: InputModel = this.inputForm.value; // Get form values
     console.log('Form data:', formData); // Log form values to console
  }

  toggleButton(isDataButton: boolean) {
    this.Maintainage = !isDataButton;
    console.log(this.Maintainage);
  }
}
