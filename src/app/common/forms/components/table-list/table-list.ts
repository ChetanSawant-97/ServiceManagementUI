import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-table-list',
  imports: [CommonModule, TableModule],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
})
export class TableList implements OnChanges{
  ngOnChanges(changes: SimpleChanges): void {
    this.columns = changes['columns'].currentValue;
    this.data = changes['data'].currentValue;
  }

  


  @Input({ required: true }) columns: TableColumn[] = [];
  @Input({ required: true }) data: any[] = [];
  @Input() loading: boolean = false;
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];

  @Output() rowClick = new EventEmitter<any>();

  onRowSelect(item: any) {
    this.rowClick.emit(item);
  }
}