import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TableColumn, TableList } from '../../common/forms/components/table-list/table-list';
import { Lead } from '../models/Leads';
import { LeadService } from '../leads.service';
import { SalesPersonService } from '../../sales/services/SalesPerson.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectComponent } from '../../common/forms/components/input-select/input-select';

@Component({
  selector: 'app-leads-management',
  imports: [TableList,SelectComponent],
  templateUrl: './leads-management.html',
  styleUrl: './leads-management.scss',
})
export class LeadsManagement {
  private leadService = inject(LeadService);
  private salesService = inject(SalesPersonService);
  private cdr = inject(ChangeDetectorRef);

  // Form control for the dropdown filter
  public selectedPersonControl = new FormControl<number | null>(null);
  public personOptions: { label: string; value: number }[] = [];
  private filterSub?: Subscription;

  isLoading = false;
  tableData: Lead[] = [];

  tableColumns: TableColumn[] = [
    { field: 'name', header: 'Distributor Name', width: '25%' },
    { field: 'mobileNumber', header: 'Mobile No.', width: '15%' },
    { field: 'location', header: 'Location', width: '35%' },
    { field: 'salesPersonName', header: 'Sales Person', width: '25%' }
  ];

  ngOnInit(): void {
    // 1. Load the dropdown options
    this.loadSalesPersons();

    // 2. Fetch all leads initially (no filter applied)
    this.fetchLeads();

    // 3. Listen for dropdown selection changes to refetch data
    this.filterSub = this.selectedPersonControl.valueChanges.subscribe(salesId => {
      // Pass the selected ID, or undefined if the user clears the dropdown
      this.fetchLeads(salesId ?? undefined);
    });
  }

  ngOnDestroy(): void {
    if (this.filterSub) {
      this.filterSub.unsubscribe();
    }
  }

  loadSalesPersons() {
    this.salesService.getAllSalesPersons().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.personOptions = response.data.map((sp: any) => ({
            label: sp.fullName,
            value: sp.salesPersonId 
          }));
        }
      },
      error: (error) => console.error('Error fetching sales persons:', error)
    });
  }

  fetchLeads(salesId?: number) {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.leadService.getLeads(salesId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.tableData = res.data.filter(lead => !lead.isDeleted); 
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
}
