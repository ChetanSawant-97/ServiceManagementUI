import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
// Adjust this path to wherever your service actually lives relative to the table component
import { UiFeedbackService } from '../../../UiFeedbackService.service'; 
import { FormatDatePipe } from '../../pipes/format-date.pipe';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule,FormatDatePipe],
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

  @Output() rowClick = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  
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
}