import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper, TuiSelect } from '@taiga-ui/kit';

@Component({
  selector: 'app-input-select',
  imports: [ReactiveFormsModule, 
    TuiTextfield, 
    TuiSelect, 
    TuiDataListWrapper, 
    TuiChevron
  ],
  templateUrl: './input-select.html',
  styleUrl: './input-select.scss',
})
export class InputSelect {
  control = input.required<FormControl>();
  items = input.required<readonly string[] | readonly any[]>();
  label = input<string>('');
  placeholder = input<string>('Select option');
  size = input<'s' | 'm' | 'l'>('m');
  
  selectId = input<string>(`vtx-select-${crypto.randomUUID().substring(0, 8)}`);



}
