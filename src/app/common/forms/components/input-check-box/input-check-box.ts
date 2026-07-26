import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiCheckbox } from '@taiga-ui/core';
import {  } from '@taiga-ui/kit';

@Component({
  selector: 'app-input-check-box',
  imports: [TuiCheckbox, ReactiveFormsModule],
  templateUrl: './input-check-box.html',
  styleUrl: './input-check-box.scss',
})
export class InputCheckBox {
  control = input.required<FormControl>();
  label = input.required<string>();
}
