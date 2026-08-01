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
import { getFormErrorMessages } from '../../common/Utility';
import { DealerService } from '../dealer.service';
import { DealerMaster } from '../models/DealerMaster';
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
  imports: [
    CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, 
    TableList, InputText, TabsModule, AddressComponent, InputCheckBox, InputPasswordComponent 
  ],
  templateUrl: './dealer-management.html',
  styleUrl: './dealer-management.scss',
})
export class DealerManagement implements OnInit {
  private dealerService = inject(DealerService);
  private cdr = inject(ChangeDetectorRef); // <-- Injected to force immediate UI updates
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
    { field: 'dealerName', header: 'Dealer Name', width: '25%' },
    { field: 'branchCode', header: 'Branch Code', width: '15%' },
    { field: 'emailId', header: 'Email Id', width: '25%' },
    { field: 'mobileNo', header: 'Mobile Number', width: '20%' },
    { field: 'isActive', header: 'Active', width: '10%' },
  ];

  tableData: DealerMaster[] = [];

  public dealerForm = new FormGroup({
    dealerId: new FormControl(0), 
    dealerName: new FormControl('', [Validators.required]),
    branchCode: new FormControl('', [Validators.required]),
    emailId: new FormControl('', [Validators.email, Validators.required]),
    mobileNo: new FormControl('', [Validators.required, Validators.minLength(10)]),
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
    username: new FormControl('', [Validators.required]), 
    password: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.fetchDealers();

    this.dealerForm.valueChanges.subscribe(() => {
      this.computeAllError();
    });  
  }

  // --- API Integrations ---

  fetchDealers() {
    this.isLoading = true;
    this.cdr.detectChanges(); // Force loader to show immediately

    this.dealerService.getAllDealers().subscribe({
      next: (res) => {
        if (res.success) {
          // Destructure into a NEW array reference so the p-table instantly detects the change
          this.tableData = [...res.data]; 
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Force table to render immediately
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
      return;
    }

    this.isSaving = true;
    const payload = this.dealerForm.getRawValue() as any;
    const dealerId = payload.dealerId;

    const saveRequest$ = (dealerId && dealerId > 0)
      ? this.dealerService.updateDealer(dealerId, payload)
      : this.dealerService.createDealer(payload);

    saveRequest$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm(); // This will now properly reset the form and close it
        this.fetchDealers(); // Fetch the latest data
      },
      error: () => {
        this.isSaving = false;
        // On error, we leave the form open so the user can fix the data
        this.cdr.detectChanges();
      }
    });
  }

  deleteRow(deletedRow: DealerMaster) {
    
    this.uiFeedbackService.confirmDelete(
      deletedRow.dealerName, 
      () => {
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
    );
  }

  // --- UI Interactions ---

  openForm() {
    this.resetFormToDefault();
    this.isOpen = true;
    this.currentTab.set(0);
    this.formErrors = [];
  }

  closeForm() {
    this.isOpen = false;
    this.resetFormToDefault(); // Clear data immediately when closing
    this.cdr.detectChanges(); // Force UI to remove the modal immediately
  }

  editRow(editedRow: DealerMaster) {
    // 1. Open the form immediately so the user sees the modal pop up
    this.openForm(); 
    
    // Optional: show a loading state while fetching the full data
    this.isLoading = true; 
    this.cdr.detectChanges();

    // 2. Call the By ID API using the ID from the list object
    this.dealerService.getDealerById(editedRow.dealerId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // 3. Populate the form with the FULL data object from the API
          this.dealerForm.patchValue(res.data);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        // If the API fails, close the modal and reset loading state
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
    this.formErrors = getFormErrorMessages(this.dealerForm);
  }

  // Helper method to ensure form resets to the exact correct defaults
  private resetFormToDefault() {
    this.dealerForm.reset({
      dealerId: 0,
      addressId: 0,
      isActive: true,
      country: 'India'
    });
  }
}