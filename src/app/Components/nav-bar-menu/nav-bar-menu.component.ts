import { RepositoryHandlerService } from './../../Services/repository-handler.service';
import { InputModel } from './../../Model/input-model';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgForOf, NgIf, formatDate } from '@angular/common';
import { DataViewComponent } from '../data-view/data-view.component';
// import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-nav-bar-menu',
  standalone: true,
  imports: [ReactiveFormsModule, DataViewComponent, NgIf, NgForOf],
  templateUrl: './nav-bar-menu.component.html',
  styleUrl: './nav-bar-menu.component.css',
})
export class NavBarMenuComponent {
  currentDate: string;
  Maintainage: boolean = false;
  VisualToggle: boolean = true;
  LazyloadToggle: boolean;
  inputForm: FormGroup;
  deleteForm: FormGroup;
  infoFeedback: string;
   searchTimeout: any;

  searchControl = new FormControl('');
  showDropdown = false;
  options: string[] = [];
  filteredOptions: string[] = [];

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
      numChunks: [5],
    });

    this.deleteForm = this.fb.group({
      deleteDate: [new Date()],
    });

    this.repository.info$.subscribe((message) => {
      this.infoFeedback = message;
    });
  }

  //method calls the service layer for data & removes old data from the view
  GetWeatherData() {
    let chunkSize = this.inputForm.get('numChunks').value;
    const input: InputModel = {
      FromDate: this.inputForm.get('FromDate').value,
      TodDate: this.inputForm.get('ToDate').value,
      Coordinates: [this.inputForm.get('Address').value],
      DataSource: this.inputForm.get('DataSource').value,
    };

    if (input.Coordinates[0] == '') {
      input.Coordinates = [];
    }
    if (chunkSize > 100) {
      chunkSize = 100;
    }


    if (input.Coordinates.length == 1) {
      const id = this.repository.getLOcationIndex(input.Coordinates[0]);

      this.repository.RunCleanup();
      this.repository.getLocations(id, id).subscribe({
        next: (locations) => {
          input.Coordinates = locations;

          this.repository.ChunkAmount = chunkSize;
          this.repository.getWeatherData(input);
          this.repository.userInput = input;
        },
      });
    } else {

      this.repository.getLocations(0, chunkSize).subscribe({
        next: (locations) => {
          input.Coordinates = locations;
          this.repository.ChunkAmount = chunkSize;
          this.repository.getWeatherData(input);
          this.repository.userInput = input;
        },
      });
      this.repository.RunCleanup();
    }
  }

  //calls the repository service to remove old weatherdata in the database & file server
  DeleteWeatherData() {
    const formData: Date = this.deleteForm.get('deleteDate').value;

    this.repository.deleteData(formData);
    this.repository.RunCleanup();
  }

  //calls the repository service to restore data in the database & file server
  RestoreData() {

    this.repository.restoreData();
    this.repository.RunCleanup();
  }

  //method to toggle between data view and maintainage view
  toggleButton(isDataButton: boolean) {

    this.Maintainage = !isDataButton;
    this.resetFedBack();
  }

  //method to toggle between showing cards or lists
  visualToggleClick() {
    this.VisualToggle = !this.VisualToggle;

  }

  //method for resetting feedback text in maintainage view
  resetFedBack() {
    if (this.infoFeedback != '') {
      this.infoFeedback = '';
    }
  }

  //event listening on user input
  onInput(event: any) {
    const inputValue = (event.target as HTMLInputElement).value.trim();


    if (!inputValue) {
      this.filteredOptions = [];
      return;
    }

    clearTimeout(this.searchTimeout);
    // Clear filteredOptions if input is empty
    this.searchTimeout = setTimeout(() => {


      const searchText = inputValue.toLowerCase();
      this.repository.getAddresses(searchText).subscribe(data => {
        this.filteredOptions = data;
      });
    }, 600);
  }

  //updates the form data after selecting an address
  onOptionSelected(option: string) {
    this.inputForm.get('Address').setValue(option);
  }

  onInputChange(event: any) {
    const value = parseInt(event.target.value, 10);
    const max = parseInt(event.target.max, 10);

    if (value > max) {
      event.target.value = max;
      this.inputForm.controls['numChunks'].setValue(max);
    }
  }

  DisableLocationsInput(addressValue: string) {
    if(addressValue.length > 0)
      {
        this.inputForm.get('numChunks')!.disable();
        this.inputForm.controls['numChunks'].setValue(1);
      }
      else
      {
        this.inputForm.get('numChunks')!.enable();
      }
  }
}
