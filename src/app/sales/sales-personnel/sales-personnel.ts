import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { getFormErrorMessages } from '../../common/Utility';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputPasswordComponent } from '../../common/forms/components/input-password/input-password-component';
import { InputText } from '../../common/forms/components/input-text/input-text';
import { TableColumn, TableList } from '../../common/forms/components/table-list/table-list';
import { SelectComponent } from '../../common/forms/components/input-select/input-select';
import { ProfileUpload } from '../../common/forms/components/profile-upload/profile-upload.component';
import { SalesPersonService } from '../services/SalesPerson.service';
import { DealerService } from '../../dealer/dealer.service';
import { DesignationService } from '../services/Designation.service';
import { SalesPerson, SalesPersonPayload } from '../models/SalesPersons';

@Component({
  selector: 'app-sales-personnel',
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, 
    TableList, InputText, InputPasswordComponent, SelectComponent, ProfileUpload
  ],
  templateUrl: './sales-personnel.html',
  styleUrl: './sales-personnel.scss',
})
export class SalesPersonnel {
  private salesPersonService = inject(SalesPersonService);
  private dealerService = inject(DealerService);
  private designationService = inject(DesignationService);
  private cdr = inject(ChangeDetectorRef);

  isOpen = false;
  isLoading = false;
  isSaving = false;
  formErrors: string[] = [];

  dealerOptions: { label: string, value: number }[] = [];
  designationOptions: { label: string, value: number }[] = [];

  tableColumns: TableColumn[] = [
    { field: 'username', header: 'User Name', width: '20%' },
    { field: 'designationName', header: 'Designation', width: '25%' },
    { field: 'dealerName', header: 'Dealer', width: '25%' },
    { field: 'mobileNumber', header: 'Mobile No.', width: '15%' },
    { field: 'isActive', header: 'Active', width: '15%' }
  ];

  tableData: SalesPerson[] = [];

  public salesForm = new FormGroup({
    userId: new FormControl(0),
    username: new FormControl('', [Validators.required]),
    password: new FormControl(''), // Required only on create
    dealerId: new FormControl<number | null>(null, [Validators.required]),
    designationId: new FormControl<number | null>(null, [Validators.required]),
    mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    aadharId: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
    pancard: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    photoBase64: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.loadDropdownData();
    this.fetchSalesPersons();

    this.salesForm.valueChanges.subscribe(() => {
      this.computeAllError();
    });  
  }

  loadDropdownData() {
    this.dealerService.getAllDealers().subscribe(res => {
      if (res.success) {
        this.dealerOptions = res.data.map(d => ({ label: d.dealerName, value: d.dealerId }));
      }
    });

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
      dealerId: formValues.dealerId!,
      designationId: formValues.designationId!,
      mobileNumber: formValues.mobileNumber ?? '',
      aadharId: formValues.aadharId ?? '',
      pancard: formValues.pancard ?? '',
      photoBase64: formValues.photoBase64 ?? ''
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
    // Enforce password requirement for new records
    this.salesForm.controls.password.setValidators([Validators.required]);
    this.salesForm.controls.password.updateValueAndValidity();
    
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
    
    // Passwords usually aren't required when updating unless changing it
    this.salesForm.controls.password.clearValidators();
    this.salesForm.controls.password.updateValueAndValidity();

    this.isLoading = true; 
    this.cdr.detectChanges();

    this.salesPersonService.getSalesPersonById(editedRow.userId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.salesForm.patchValue(res.data);
          this.salesForm.controls.password.setValue(''); // Clear password hash from UI
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

  computeAllError() {
    this.formErrors = getFormErrorMessages(this.salesForm);
  }

  private resetFormToDefault() {
    this.salesForm.reset({
      userId: 0,
      username: '',
      password: '',
      dealerId: null,
      designationId: null,
      mobileNumber: '',
      aadharId: '',
      pancard: '',
      photoBase64: ''
    });
  }
}
