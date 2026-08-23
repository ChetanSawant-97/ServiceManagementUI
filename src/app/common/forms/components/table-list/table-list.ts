import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { ColumnFilter, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { UiFeedbackService } from '../../../UiFeedbackService.service'; 
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { FormsModule } from '@angular/forms'; // <-- Add this

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'date' | 'boolean';
  filterable?: boolean;
}

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule,FormsModule,FormatDatePipe],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
})
export class TableList {
  private uiFeedbackService = inject(UiFeedbackService);

  @Input({ required: true }) columns: TableColumn[] = [];
  @Input({ required: true }) data: any[] = [];
  @Input() loading: boolean = false;
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];
  
  @Input() showActions: boolean = true;
  
  // NEW: Let the parent tell the table which field to use for the delete warning (e.g., 'dealerName')
  @Input() deleteNameKey?: string;
  @Input() enableFilterToggle: boolean = true; // Turn the feature on/off
  showInlineFilters: boolean = false;          // Tracks if they are currently visible
  @Output() rowClick = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() filter = new EventEmitter<{ field: string, value: any }>();
  
  // Now, this event ONLY fires if the user clicks "Yes" in the confirmation box!
  @Output() delete = new EventEmitter<any>();

  onRowSelect(item: any) {
    this.rowClick.emit(item);
  }

  onEdit(item: any, event: Event) {
    event.stopPropagation();
    this.edit.emit(item);
  }

  onDelete(item: any) {
    // Dynamically grab the name based on the key provided, fallback to "this record" if none provided
    const recordName = this.deleteNameKey && item[this.deleteNameKey] 
      ? item[this.deleteNameKey] 
      : 'this record';

    // Trigger the confirmation popup from INSIDE the table component
    this.uiFeedbackService.confirmDelete(recordName, () => {
      // Only emit to the parent if they confirmed!
      this.delete.emit(item);
    });
  }

  onColumnFilter(value: any, field: string) {
    this.filter.emit({ field, value });
  }
}