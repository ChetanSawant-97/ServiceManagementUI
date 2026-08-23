import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';

import { InputText } from '../../common/forms/components/input-text/input-text';
import { TableColumn, TableList } from '../../common/forms/components/table-list/table-list';
import { AddressComponent } from '../../common/forms/components/address-component/address-component';
import { InputCheckBox } from '../../common/forms/components/input-check-box/input-check-box';
import { getFormErrorMessages, GST_REGEX, PAN_REGEX } from '../../common/Utility';
import { DealerService } from '../dealer.service';
import { DealerMaster, DealerCreatePayload, DealerUpdatePayload } from '../models/DealerMaster';
import { InputPasswordComponent } from '../../common/forms/components/input-password/input-password-component';
import { UiFeedbackService } from '../../common/UiFeedbackService.service';

export interface TabItem {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-dealer-management',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, 
    TableList, InputText, TabsModule, AddressComponent, InputCheckBox, InputPasswordComponent 
  ],
  templateUrl: './dealer-management.html',
  styleUrl: './dealer-management.scss',
})
export class DealerManagement implements OnInit {
  private dealerService = inject(DealerService);
  private cdr = inject(ChangeDetectorRef);
  private uiFeedbackService = inject(UiFeedbackService);

  
  isOpen = false;
  isLoading = false;
  isSaving = false;
  currentTab = signal<string | number>(0);
  formErrors: string[] = [];

  dealerTabs: TabItem[] = [
    { label: 'Info', value: 0, icon: 'pi pi-user' },
    { label: 'Address', value: 1, icon: 'pi pi-map-marker' },
    { label: 'Credentials', value: 2, icon: 'pi pi-unlock' }
  ];
  
  tableColumns: TableColumn[] = [
    { field: 'dealerName', header: 'Dealer Name', width: '25%', filterable:true },
    { field: 'branchCode', header: 'Branch Code', width: '15%' },
    { field: 'emailId', header: 'Email Id', width: '25%' },
    { field: 'mobileNo', header: 'Mobile Number', width: '20%', filterable:true },
    { field: 'isActive', header: 'Active', width: '10%' },
  ];

  tableData: DealerMaster[] = [];

  public dealerForm = new FormGroup({
    dealerId: new FormControl(0), 
    dealerName: new FormControl('', [Validators.required]),
    branchCode: new FormControl('', [Validators.required]),
    emailId: new FormControl('', [Validators.email, Validators.required]),
    mobileNo: new FormControl('', [Validators.required, Validators.minLength(10)]),
    
    // NEW FIELDS
    adharCard: new FormControl('', [Validators.required]),
    panCard: new FormControl('', [Validators.required,Validators.pattern(PAN_REGEX)]),
    gst: new FormControl('', [Validators.required,Validators.pattern(GST_REGEX)]),
    
    isActive: new FormControl(true),
    
    // Address fields
    addressId: new FormControl(0),
    addressLine1: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    landmark: new FormControl(''),
    area: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required]),
    country: new FormControl('India'), 
    
    // Credentials
    username: new FormControl('',Validators.required), 
    password: new FormControl('',Validators.required)
  });

  ngOnInit(): void {
    this.fetchDealers();

    this.dealerForm.valueChanges.subscribe(() => {
      this.computeAllError();
    });  
  }

  fetchDealers() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.dealerService.getAllDealers().subscribe({
      next: (res) => {
        if (res.success) {
          this.tableData = [...res.data]; 
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveDealer() {
    if (this.dealerForm.invalid) {
      this.dealerForm.markAllAsTouched();
      this.computeAllError();
      return;
    }

    this.isSaving = true;
    const formValues = this.dealerForm.getRawValue();
    const dealerId = formValues.dealerId;

    // Strict payload mapping based on Swagger contract
    const basePayload: DealerUpdatePayload = {
      dealerName: formValues.dealerName ?? '',
      branchCode: formValues.branchCode ?? '',
      mobileNo: formValues.mobileNo ?? '',
      emailId: formValues.emailId ?? '',
      adharCard: formValues.adharCard ?? '',
      panCard: formValues.panCard ?? '',
      gst: formValues.gst ?? '',
      addressLine1: formValues.addressLine1 ?? '',
      addressLine2: formValues.addressLine2 ?? '',
      landmark: formValues.landmark ?? '',
      area: formValues.area ?? '',
      city: formValues.city ?? '',
      state: formValues.state ?? '',
      pinCode: formValues.pinCode ?? '',
      country: formValues.country ?? 'India'
    };

    let saveRequest$;

    if (dealerId && dealerId > 0) {
      saveRequest$ = this.dealerService.updateDealer(dealerId, basePayload);
    } else {
      // Add username and password only for creation
      const createPayload: DealerCreatePayload = {
        ...basePayload,
        username: formValues.username ?? '',
        password: formValues.password ?? ''
      };
      saveRequest$ = this.dealerService.createDealer(createPayload);
    }

    saveRequest$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm(); 
        this.fetchDealers(); 
      },
      error: () => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteRow(deletedRow: DealerMaster) {    
    this.isLoading = true;
    this.cdr.detectChanges();

    this.dealerService.deleteDealer(deletedRow.dealerId).subscribe({
      next: () => {
        this.fetchDealers(); 
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openForm() {
    this.resetFormToDefault();
    this.isOpen = true;
    this.currentTab.set(0);
    this.computeAllError();
  }

  closeForm() {
    this.isOpen = false;
    this.resetFormToDefault(); 
    this.cdr.detectChanges(); 
  }

  editRow(editedRow: DealerMaster) {
    this.openForm(); 
    this.isLoading = true; 
    this.cdr.detectChanges();

    this.dealerService.getDealerById(editedRow.dealerId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.dealerForm.patchValue(res.data);
          
          // Optional: clear password field on edit so it doesn't show old hashed passwords
          this.dealerForm.controls.password.setValue('');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.closeForm(); 
        this.cdr.detectChanges();
      }
    });
  }

  onTabChange(value: string | number | undefined) {
    if (value !== undefined) {
      this.currentTab.set(value);
    }
  }

  computeAllError() {
      this.formErrors = getFormErrorMessages(this.dealerForm, {
        // Basic Info
        dealerName: 'Dealer Name',
        branchCode: 'Branch Code',
        emailId: 'Email Address',
        mobileNo: 'Mobile Number',
        isActive: 'Active Status',
  
        // Tax & ID Info
        adharCard: 'Aadhaar ID',
        panCard: 'PAN Card Number',
        gst: 'GST Number',
  
        // Address Fields
        addressLine1: 'Address Line 1',
        addressLine2: 'Address Line 2',
        landmark: 'Landmark',
        area: 'Area',
        city: 'City',
        state: 'State',
        pinCode: 'PIN Code',
        country: 'Country',
  
        // Credentials
        username: 'Login Username',
        password: 'Login Password'
      });
    console.warn('Current Form Errors:', this.formErrors); // Debugging line
  }

  private resetFormToDefault() {
    this.dealerForm.reset({
      dealerId: 0,
      addressId: 0,
      adharCard: '',
      panCard: '',
      gst: '',
      isActive: true,
      country: 'India'
    });
  }

  onTableFilter(event: { field: string, value: any }) {
    console.log(`User searched for ${event.value} in column ${event.field}`);
  }
}