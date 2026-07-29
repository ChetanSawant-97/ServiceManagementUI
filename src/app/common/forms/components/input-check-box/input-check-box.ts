import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-input-check-box',
  imports: [Checkbox, ReactiveFormsModule],
  templateUrl: './input-check-box.html',
  styleUrl: './input-check-box.scss',
})
export class InputCheckBox {
  control = input.required<FormControl>();
  label = input.required<string>();
}