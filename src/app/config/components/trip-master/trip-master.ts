import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { getFormErrorMessages } from '../../../common/Utility';
import { TransportDetails, TransportPayload } from '../../models/TripMaster';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableColumn, TableList } from '../../../common/forms/components/table-list/table-list';
import { TransportService } from '../../services/Transport.service';
import { InputText } from '../../../common/forms/components/input-text/input-text';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-trip-master',
  imports: [ReactiveFormsModule,InputText,ButtonModule,TableList],
  templateUrl: './trip-master.html',
  styleUrl: './trip-master.scss',
})
export class TripMaster {
  private transportService = inject(TransportService);
  private cdr = inject(ChangeDetectorRef);

  isOpen = false;
  isLoading = false;
  isSaving = false;
  formErrors: string[] = [];

  tableColumns: TableColumn[] = [
    { field: 'transportBy', header: 'Mode of Transport', width: '50%' },
    { field: 'ratePerKm', header: 'Rate per Km (₹)', width: '50%' }
  ];

  tableData: TransportDetails[] = [];

  public transportForm = new FormGroup({
    transportId: new FormControl(0), 
    transportBy: new FormControl('', [Validators.required]),
    ratePerKm: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    isDeleted: new FormControl(false)
  });

  ngOnInit(): void {
    this.fetchTransports();

    this.transportForm.valueChanges.subscribe(() => {
      this.computeAllError();
    });  
  }

  // --- API Integrations ---

  fetchTransports() {
    this.isLoading = true;
    this.cdr.detectChanges(); 

    this.transportService.getAllTransports().subscribe({
      next: (res) => {
        if (res.success) {
          // Filter out deleted items if backend returns them, or just assign directly
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

  saveTransport() {
    if (this.transportForm.invalid) {
      this.transportForm.markAllAsTouched();
      this.computeAllError();
      return;
    }

    this.isSaving = true;
    const formValues = this.transportForm.getRawValue();
    const transportId = formValues.transportId;

    const payload: TransportPayload = {
      transportBy: formValues.transportBy ?? '',
      ratePerKm: Number(formValues.ratePerKm) ?? 0
    };

    const saveRequest$ = (transportId && transportId > 0)
      ? this.transportService.updateTransport(transportId, payload)
      : this.transportService.createTransport(payload);

    saveRequest$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm(); 
        this.fetchTransports(); 
      },
      error: () => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteRow(deletedRow: TransportDetails) {    
    this.isLoading = true;
    this.cdr.detectChanges();

    this.transportService.deleteTransport(deletedRow.transportId).subscribe({
      next: () => {
        this.fetchTransports(); 
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- UI State Management ---

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

  editRow(editedRow: TransportDetails) {
    this.openForm(); 
    this.isLoading = true; 
    this.cdr.detectChanges();

    this.transportService.getTransportById(editedRow.transportId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.transportForm.patchValue(res.data);
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
    this.formErrors = getFormErrorMessages(this.transportForm);
  }

  private resetFormToDefault() {
    this.transportForm.reset({
      transportId: 0,
      transportBy: '',
      ratePerKm: null,
      isDeleted: false
    });
  }
}
