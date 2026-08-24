import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs'; // NEW IMPORT
import { InputPasswordComponent } from '../../common/forms/components/input-password/input-password-component';
import { InputText } from '../../common/forms/components/input-text/input-text';
import { TableColumn, TableList } from '../../common/forms/components/table-list/table-list';
import { SelectComponent } from '../../common/forms/components/input-select/input-select';
import { ProfileUpload } from '../../common/forms/components/profile-upload/profile-upload.component';
import { AddressComponent } from '../../common/forms/components/address-component/address-component';

import { getFormErrorMessages, PAN_REGEX } from '../../common/Utility';
import { SalesPersonService } from '../services/SalesPerson.service';
import { DesignationService } from '../services/Designation.service';
import { SalesPerson, SalesPersonPayload } from '../models/SalesPersons';

export interface TabItem {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-sales-personnel',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, TabsModule,
    TableList, InputText, InputPasswordComponent, SelectComponent, ProfileUpload, AddressComponent
  ],
  templateUrl: './sales-personnel.html',
  styleUrl: './sales-personnel.scss',
})
export class SalesPersonnel implements OnInit {
  private salesPersonService = inject(SalesPersonService);
  private designationService = inject(DesignationService);
  private cdr = inject(ChangeDetectorRef);

  isOpen = false;
  isLoading = false;
  isSaving = false;
  formErrors: string[] = [];

  // Tab State
  currentTab = signal<string | number>(0);
  salesTabs: TabItem[] = [
    { label: 'Info', value: 0, icon: 'pi pi-user' },
    { label: 'Address', value: 1, icon: 'pi pi-map-marker' }
  ];

  designationOptions: { label: string, value: number }[] = [];

  tableColumns: TableColumn[] = [
    { field: 'fullName', header: 'Full Name', width: '25%', filterable: true },
    { field: 'username', header: 'User Name', width: '20%' },
    { field: 'designationName', header: 'Designation', width: '25%' },
    { field: 'mobileNumber', header: 'Mobile No.', width: '15%' },
    { field: 'isActive', header: 'Active', width: '15%' }
  ];

  tableData: SalesPerson[] = [];

  public salesForm = new FormGroup({
    userId: new FormControl(0),
    username: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    fullName: new FormControl('', [Validators.required]),
    designationId: new FormControl<number | null>(null, [Validators.required]),
    mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    aadharId: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
    pancard: new FormControl('', [Validators.required, Validators.pattern(PAN_REGEX)]),
    photoBase64: new FormControl('', [Validators.required]),
    
    // Address fields
    addressLine1: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    landmark: new FormControl(''),
    area: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required]),
    country: new FormControl('India')
  });

  constructor() {
    this.salesForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.computeAllError();
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
    this.fetchSalesPersons();
  }

  loadDropdownData() {
    this.designationService.getAllDesignations().subscribe(res => {
      if (res.success) {
        this.designationOptions = res.data.map(d => ({ label: d.designationName, value: d.designationId }));
      }
    });
  }

  fetchSalesPersons() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.salesPersonService.getAllSalesPersons().subscribe({
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

  saveSalesPerson() {
    if (this.salesForm.invalid) {
      this.salesForm.markAllAsTouched();
      this.computeAllError();
      return;
    }

    this.isSaving = true;
    const formValues = this.salesForm.getRawValue();
    const userId = formValues.userId;

    const payload: SalesPersonPayload = {
      username: formValues.username ?? '',
      password: formValues.password ?? '',
      fullName: formValues.fullName ?? '',
      designationId: formValues.designationId!,
      mobileNumber: formValues.mobileNumber ?? '',
      aadharId: formValues.aadharId ?? '',
      pancard: formValues.pancard ?? '',
      photoBase64: formValues.photoBase64 ?? '',
      addressLine1: formValues.addressLine1 ?? '',
      addressLine2: formValues.addressLine2 ?? '',
      landmark: formValues.landmark ?? '',
      area: formValues.area ?? '',
      city: formValues.city ?? '',
      state: formValues.state ?? '',
      pinCode: formValues.pinCode ?? '',
      country: formValues.country ?? 'India'
    };

    const saveRequest$ = (userId && userId > 0)
      ? this.salesPersonService.updateSalesPerson(userId, payload)
      : this.salesPersonService.createSalesPerson(payload);

    saveRequest$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm(); 
        this.fetchSalesPersons(); 
      },
      error: () => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteRow(deletedRow: SalesPerson) {    
    this.isLoading = true;
    this.cdr.detectChanges();

    this.salesPersonService.deleteSalesPerson(deletedRow.userId).subscribe({
      next: () => {
        this.fetchSalesPersons(); 
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openForm() {
    this.resetFormToDefault();
    this.salesForm.controls.password.setValidators([Validators.required]);
    this.salesForm.controls.password.updateValueAndValidity();
    
    this.currentTab.set(0); // Reset to Info tab on open
    this.isOpen = true;
    this.computeAllError();
  }

  closeForm() {
    this.isOpen = false;
    this.resetFormToDefault(); 
    this.cdr.detectChanges(); 
  }

  editRow(editedRow: SalesPerson) {
    this.openForm(); 
    
    this.salesForm.controls.password.clearValidators();
    this.salesForm.controls.password.updateValueAndValidity();

    this.isLoading = true; 
    this.cdr.detectChanges();

    this.salesPersonService.getSalesPersonById(editedRow.userId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.salesForm.patchValue(res.data);
          this.salesForm.controls.password.setValue(''); 
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
    this.formErrors = getFormErrorMessages(this.salesForm, {
      fullName: 'Full Name',
      designationId: 'Designation',
      aadharId: 'Aadhar ID',
      pancard: 'PAN Card',
      photoBase64: 'Profile Photo',
      addressLine1: 'Address Line 1',
      pinCode: 'PIN Code'
    });
  }

  private resetFormToDefault() {
    this.salesForm.reset({
      userId: 0,
      username: '',
      password: '',
      fullName: '',
      designationId: null,
      mobileNumber: '',
      aadharId: '',
      pancard: '',
      photoBase64: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      area: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India'
    });
  }
}