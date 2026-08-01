import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
})
export class TableList {
  @Input({ required: true }) columns: TableColumn[] = [];
  @Input({ required: true }) data: any[] = [];
  @Input() loading: boolean = false;
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];
  
  // 1. Add the new flag (Defaults to true)
  @Input() showActions: boolean = true;

  @Output() rowClick = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  
  // 2. Ensure delete emits the event for ConfirmPopup
  @Output() delete = new EventEmitter<any>();

  onRowSelect(item: any) {
    this.rowClick.emit(item);
  }

  onEdit(item: any, event: Event) {
    event.stopPropagation();
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit( item );
  }
}