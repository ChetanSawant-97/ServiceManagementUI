import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from '../../common/forms/components/input-text/input-text';
import { TableColumn, TableList } from '../../common/forms/components/table-list/table-list';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { BaseModalComponent } from '../../common/forms/components/base-modal-component/base-modal-component';
import { TabsModule } from 'primeng/tabs';
import { AddressComponent } from '../../common/forms/components/address-component/address-component';
import { Address } from '../../common/home/models/AddressModel';
import { FormModel } from '../../common/forms/FormsUtility';
import { DealerMaster } from '../models/DealerMaster';
import { InputCheckBox } from '../../common/forms/components/input-check-box/input-check-box';
import { getFormErrorMessages } from '../../common/Utility';

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
    AddressComponent,
    InputCheckBox],
  templateUrl: './dealer-management.html',
  styleUrl: './dealer-management.scss',
})
export class DealerManagement implements OnInit {
  formErrors : string[] = [];
  isAddressValid : boolean = false;
  ngOnInit(): void {
    this.dealer.valueChanges.subscribe(value=>{
      this.computeAllError();
    })  
  }
  
  isOpen = false;
  isLoading = false;
  currentTab = signal<string | number>(0);

  dealerTabs: TabItem[] = [
    { label: 'Info', value: 0, icon: 'pi pi-user' },
    { label: 'Address', value: 1, icon: 'pi pi-map-marker' }
  ];
  
  tableColumns :TableColumn[] = [
    { field: 'name', header: 'Dealer Name',width:'25%' },
    { field: 'branch_code', header: 'Branch Code',width:'15%' },
    { field: 'email_id', header: 'Email Id',width:'25%' },
    { field: 'mobile_no', header: 'Mobile Number',width:'20%' },
    { field: 'is_active', header: 'Active',width:'10%' },

  ];
  tableData : DealerMaster[] = [];

  openForm() {
    this.dealer.reset();
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
    mobile_no : new FormControl('',[Validators.required,Validators.minLength(10)]),
    name : new FormControl('',[Validators.required]),
    updated_by : new FormControl(''),
    updated_date : new FormControl('')
  });


  saveDealer() {
   
    console.log('Payload:', this.dealer.value);
    
    this.tableData = [...this.tableData, this.dealer.value as DealerMaster];
    
    this.isOpen = false;
    console.warn(this.tableData);
  }

  handleRowClick(event: any) {
    console.log('Row clicked:', event);
  }

  computeAllError(errorsFromAddress ?: string[]){
    this.formErrors = [...getFormErrorMessages(this.dealer),...errorsFromAddress || []];
  }
}
