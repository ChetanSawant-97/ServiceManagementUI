import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { getFormErrorMessages } from '../../common/Utility';
import { DesignationDetails, DesignationPayload } from '../models/Designation';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableColumn, TableList } from '../../common/forms/components/table-list/table-list';
import { DesignationService } from '../services/Designation.service';
import { InputText } from '../../common/forms/components/input-text/input-text';
import { SelectComponent } from '../../common/forms/components/input-select/input-select';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-designation',
  imports: [ReactiveFormsModule,TableList,InputText,SelectComponent,ButtonModule],
  templateUrl: './designation.html',
  styleUrl: './designation.scss',
})
export class Designation {
  private designationService = inject(DesignationService);
  private cdr = inject(ChangeDetectorRef);

  isOpen = false;
  isLoading = false;
  isSaving = false;
  formErrors: string[] = [];

  // Dropdown options for self-referencing (Reporting To)
  reportingOptions: { label: string, value: number }[] = [];

  tableColumns: TableColumn[] = [
    { field: 'designationName', header: 'Designation', width: '50%' },
    { field: 'reportingDesignationName', header: 'Reports To', width: '50%' }
  ];

  tableData: DesignationDetails[] = [];

  public designationForm = new FormGroup({
    designationId: new FormControl(0), 
    designationName: new FormControl('', [Validators.required]),
    reportingDesignationId: new FormControl<number>(0), // Default to 0 for Top-level
    isDeleted: new FormControl(false)
  });

  ngOnInit(): void {
    this.fetchDesignations();

    this.designationForm.valueChanges.subscribe(() => {
      this.computeAllError();
    });  
  }

  fetchDesignations() {
    this.isLoading = true;
    this.cdr.detectChanges(); 

    this.designationService.getAllDesignations().subscribe({
      next: (res) => {
        if (res.success) {
          this.tableData = [...res.data]; 
          
          // Populate the dropdown list for "Reporting To" and add a "None" option
          this.reportingOptions = [
            { label: '-- Top Level (None) --', value: 0 },
            ...res.data.map(d => ({ label: d.designationName, value: d.designationId }))
          ];
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

  saveDesignation() {
    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      this.computeAllError();
      return;
    }

    this.isSaving = true;
    const formValues = this.designationForm.getRawValue();
    const designationId = formValues.designationId;

    const payload: DesignationPayload = {
      designationName: formValues.designationName ?? '',
      reportingDesignationId: formValues.reportingDesignationId ?? 0
    };

    const saveRequest$ = (designationId && designationId > 0)
      ? this.designationService.updateDesignation(designationId, payload)
      : this.designationService.createDesignation(payload);

    saveRequest$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm(); 
        this.fetchDesignations(); 
      },
      error: () => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteRow(deletedRow: DesignationDetails) {    
    this.isLoading = true;
    this.cdr.detectChanges();

    this.designationService.deleteDesignation(deletedRow.designationId).subscribe({
      next: () => {
        this.fetchDesignations(); 
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
    this.computeAllError();
  }

  closeForm() {
    this.isOpen = false;
    this.resetFormToDefault(); 
    this.cdr.detectChanges(); 
  }

  editRow(editedRow: DesignationDetails) {
    this.openForm(); 
    this.isLoading = true; 
    this.cdr.detectChanges();

    this.designationService.getDesignationById(editedRow.designationId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.designationForm.patchValue(res.data);
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
    this.formErrors = getFormErrorMessages(this.designationForm);
  }

  private resetFormToDefault() {
    this.designationForm.reset({
      designationId: 0,
      designationName: '',
      reportingDesignationId: 0,
      isDeleted: false
    });
  }
}
