import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SelectComponent } from '../../../common/forms/components/input-select/input-select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-track-sales',
  imports: [CommonModule,SelectComponent,ReactiveFormsModule],
  templateUrl: './track-sales.html',
  styleUrl: './track-sales.scss',
})
export class TrackSales {
  public selectedPersonControl = new FormControl(null);
  public personOptions = [
    { label: 'John Doe', value: 'john_doe' },
    { label: 'Jane Smith', value: 'jane_smith' },
    { label: 'Alice Johnson', value: 'alice_johnson' },
  ];
}
