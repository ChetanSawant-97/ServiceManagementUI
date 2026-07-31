import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-input-date',
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule],
  templateUrl: './input-date-component.html',
  styleUrl: './input-date-component.scss',
})
export class InputDateComponent {
  // Required form control
  control = input.required<FormControl>();
  
  // Basic properties
  label = input<string>('');
  placeholder = input<string>('Select date');
  
  // Date constraints
  minDate = input<Date | undefined>(undefined);
  maxDate = input<Date | undefined>(undefined);
  
  // UI Configuration
  showIcon = input<boolean>(true);
  iconDisplay = input<'input' | 'button'>('input');
  
  // Dynamic ID generation for accessibility 
  inputId = input<string>(`vtx-date-${crypto.randomUUID().substring(0, 8)}`);
}