import { Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

// common-table.ts
export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-table-list',
  imports: [CommonModule,TableModule],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
})
export class TableList {
  // Inputs using Angular Signals
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  loading = input<boolean>(false);
  paginator = input<boolean>(true);
  rows = input<number>(10);
  rowsPerPageOptions = input<number[]>([5, 10, 20, 50]);

  // Event emitters for row interactions if needed
  rowClick = output<any>();

  onRowSelect(item: any) {
    this.rowClick.emit(item);
  }
}
