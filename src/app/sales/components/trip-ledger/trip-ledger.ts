import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TripService } from '../../../TrackSales/services/trip.service';
import { SalesPersonService } from '../../services/SalesPerson.service';
import { TripReportResponse } from '../../../TrackSales/models/trip-report.model';
import { TableColumn, TableList } from '../../../common/forms/components/table-list/table-list';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectComponent } from '../../../common/forms/components/input-select/input-select';
import { InputText } from '../../../common/forms/components/input-text/input-text';
import { InputDateComponent } from '../../../common/forms/components/input-date-component/input-date-component';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-trip-ledger',
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, 
    TableList, InputText, SelectComponent,InputDateComponent
  ],
  templateUrl: './trip-ledger.html',
  styleUrl: './trip-ledger.scss',
})
export class TripLedger {
  private tripService = inject(TripService);
  private salesPersonService = inject(SalesPersonService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = false;
  showDateRange = false; 
  salesPersonOptions: { label: string, value: number }[] = [];
  tableData: TripReportResponse[] = [];

  tableColumns: TableColumn[] = [
    { field: 'salesPersonName', header: 'Sales Person', width: '20%', filterable: true },
    { field: 'travelDate', header: 'Travel Date', width: '15%' },
    { field: 'transportBy', header: 'Transport', width: '15%' },
    { field: 'actualDistance', header: 'Actual (Km)', width: '10%' },
    { field: 'estimatedDistance', header: 'Est. (Km)', width: '10%' },
    { field: 'ratePerKm', header: 'Rate/Km', width: '10%' },
    { field: 'totalTravelAmount', header: 'Total Amt', width: '15%' }
  ];

  private getTodayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  public reportForm = new FormGroup({
    salesPersonId: new FormControl<number | null>(null, [Validators.required]),
    fromDate: new FormControl(this.getTodayStr(), [Validators.required]),
    toDate: new FormControl(this.getTodayStr(), [Validators.required])
  });

  constructor() {
    // NEW: Real-time Reactive API Fetching
    this.reportForm.valueChanges
      .pipe(
        debounceTime(300), // Waits 300ms after the last UI interaction before firing
        takeUntilDestroyed()
      )
      .subscribe(() => {
        // Only fetch if a Sales Person is selected and dates are valid
        if (this.reportForm.valid) {
          this.fetchReport();
        } else {
          // If they clear the dropdown, empty the table
          this.tableData = [];
          this.cdr.detectChanges();
        }
      });
  }

  ngOnInit(): void {
    this.loadDropdownData();
    // Removed the fetch call from here; it stays empty until a user is picked!
  }

  loadDropdownData() {
    this.salesPersonService.getAllSalesPersons().subscribe(res => {
      if (res.success && res.data) {
        this.salesPersonOptions = res.data.map(sp => ({ 
          label: sp.fullName, 
          value: sp.userId 
        }));
      }
    });
  }

  toggleDateRange() {
    this.showDateRange = !this.showDateRange;
    
    // Instantly reset dates to today if they turn off the toggle.
    // This will trigger `valueChanges`, automatically re-fetching the data!
    if (!this.showDateRange) {
      this.reportForm.patchValue({
        fromDate: this.getTodayStr(),
        toDate: this.getTodayStr()
      });
    }
  }

  fetchReport() {
    this.isLoading = true;
    this.cdr.detectChanges();

    const payload = {
      salesPersonId: this.reportForm.value.salesPersonId!,
      fromDate: this.reportForm.value.fromDate!,
      toDate: this.reportForm.value.toDate!
    };

    this.tripService.getTripReport(payload).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.tableData = [...res.data]; 
        } else {
          this.tableData = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.tableData = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  clearFilters() {
    this.reportForm.reset({
      salesPersonId: null,
      fromDate: this.getTodayStr(),
      toDate: this.getTodayStr()
    });
    this.showDateRange = false; 
    // `valueChanges` catches this reset and automatically clears the table for you.
  }
}
