import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from '../../common/forms/components/input-text/input-text';
import { TableList } from '../../common/forms/components/table-list/table-list';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BaseModalComponent } from '../../common/forms/components/base-modal-component/base-modal-component';
import { TabsModule } from 'primeng/tabs';
import { AddressComponent } from '../../common/forms/components/address-component/address-component';
import { Address } from '../../common/home/models/AddressModel';
import { FormModel } from '../../common/forms/FormsUtility';
import { DealerMaster } from '../models/DealerMaster';

export interface TabItem {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-dealer-management',
  imports: [CommonModule, 
    ReactiveFormsModule, 
    DialogModule, 
    ButtonModule,
    TableList,
    InputText,
    BaseModalComponent,
    TabsModule,
    AddressComponent],
  templateUrl: './dealer-management.html',
  styleUrl: './dealer-management.scss',
})
export class DealerManagement {
  isOpen = false;
  isLoading = false;
  currentTab = signal<string | number>(0);

  dealerTabs: TabItem[] = [
    { label: 'Info', value: 0, icon: 'pi pi-user' },
    { label: 'Address', value: 1, icon: 'pi pi-map-marker' }
  ];
  
  tableColumns = [
    { field: 'name', header: 'Dealer Name' }
  ];
  tableData = [];

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  openForm() {
    this.formGroup.reset();
    this.isOpen = true;
  }
  closeForm() {
    this.isOpen = false;
  }

  onTabChange(value: string | number | undefined) {
    if (value !== undefined) {
      this.currentTab.set(value);
    }
  }


  public address : Address = new Address;
  
  public dealer : FormGroup<FormModel<DealerMaster>> = new FormGroup({
    address_id : new FormControl(''),
    branch_code : new FormControl('',[Validators.required]),
    created_by : new FormControl(''),
    created_date : new FormControl(''),
    email_id : new FormControl('',[Validators.email]),
    is_active : new FormControl(true),
    is_deleted : new FormControl(false),
    mobile_no : new FormControl('',[Validators.required]),
    name : new FormControl('',[Validators.required]),
    updated_by : new FormControl(''),
    updated_date : new FormControl('')
  });


  saveDealer() {
    if (this.formGroup.valid) {
      console.log('Payload:', this.formGroup.value);
      // Call service to save, then close modal
      this.isOpen = false;
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  //Table Actions
  handleRowClick(event: any) {
    console.log('Row clicked:', event);
  }

}
