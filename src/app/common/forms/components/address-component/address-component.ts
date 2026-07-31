import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DistrictData, INDIA_LOCATIONS_DATA, StateData } from '../../../Utility';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-address-component',
  imports: [CommonModule, ReactiveFormsModule, SelectModule, InputTextModule],
  templateUrl: './address-component.html',
  styleUrl: './address-component.scss',
})
export class AddressComponent implements OnInit, OnDestroy {
  // Accept individual FormControls from the parent
  @Input({ required: true }) firstLine!: FormControl;
  @Input({ required: true }) secondLine!: FormControl;
  @Input({ required: true }) landMark!: FormControl;
  @Input({ required: true }) area!: FormControl;
  @Input({ required: true }) pincode!: FormControl;
  @Input({ required: true }) city!: FormControl;
  @Input({ required: true }) state!: FormControl;

  statesList: StateData[] = INDIA_LOCATIONS_DATA;
  availableDistricts: DistrictData[] = [];
  
  private stateSub?: Subscription;

  ngOnInit(): void {
    // Populate districts if the state control already has a value on initialization
    if (this.state.value) {
      this.updateDistricts(this.state.value);
    }

    // Listen for state changes to update the dependent city dropdown
    this.stateSub = this.state.valueChanges.subscribe((newState: string) => {
      this.updateDistricts(newState);
      
      const currentCity = this.city.value;
      const isValidCity = this.availableDistricts.some(d => d.district === currentCity);
      if (!isValidCity) {
        this.city.setValue(''); // Clear city if it doesn't belong to the new state
      }
    });
  }

  ngOnDestroy(): void {
    if (this.stateSub) {
      this.stateSub.unsubscribe();
    }
  }

  private updateDistricts(stateName: string): void {
    const foundState = this.statesList.find(s => s.state === stateName);
    this.availableDistricts = foundState ? foundState.districts : [];
  }
}