import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-input-select',
  imports: [ReactiveFormsModule, Select],
  templateUrl: './input-select.html',
  styleUrl: './input-select.scss',
})
export class InputSelect {
  control = input.required<FormControl>();
  items = input.required<any[]>();
  label = input<string>('');
  placeholder = input<string>('Select option');
  size = input<'s' | 'm' | 'l'>('m');
  
  selectId = input<string>(`vtx-select-${crypto.randomUUID().substring(0, 8)}`);
}