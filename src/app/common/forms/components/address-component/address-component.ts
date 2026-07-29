import { Component, output } from '@angular/core';
import { Address } from '../../../home/models/AddressModel';
import { DistrictData, INDIA_LOCATIONS_DATA, StateData } from '../../../Utility';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-address-component',
  imports: [CommonModule, ReactiveFormsModule, SelectModule, InputTextModule],
  templateUrl: './address-component.html',
  styleUrl: './address-component.scss',
})
export class AddressComponent {
  // Outputs emitted on form value modifications and direct status checks
  valueChange = output<Address>();
  statusChange = output<boolean>();

  statesList: StateData[] = INDIA_LOCATIONS_DATA;
  availableDistricts: DistrictData[] = [];
  
  private sub?: Subscription;

  public addressForm: FormGroup = new FormGroup({
    firstLine: new FormControl('', [Validators.required]),
    secondLine: new FormControl(''),
    landMark: new FormControl(''),
    area: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.addressForm.get('state')?.valueChanges.subscribe((newState: string) => {
      const foundState = this.statesList.find(s => s.state === newState);
      this.availableDistricts = foundState ? foundState.districts : [];
      
      const currentCity = this.addressForm.get('city')?.value;
      const isValidCity = this.availableDistricts.some(d => d.district === currentCity);
      if (!isValidCity) {
        this.addressForm.get('city')?.setValue('');
      }
    });

    this.sub = this.addressForm.valueChanges.subscribe(() => {
      this.valueChange.emit(this.addressForm.value as Address);
      this.statusChange.emit(this.addressForm.valid);
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public getAddressValue(): Address {
    return this.addressForm.value as Address;
  }

  public isValid(): boolean {
    return this.addressForm.valid;
  }

  public markAllTouched(): void {
    this.addressForm.markAllAsTouched();
  }
}
