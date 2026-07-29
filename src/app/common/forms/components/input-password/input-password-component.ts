import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-input-password',
  imports: [ReactiveFormsModule, PasswordModule],
  templateUrl: './input-password-component.html',
  styleUrl: './input-password-component.scss',
})
export class InputPasswordComponent {
  control = input.required<FormControl>();
  label = input<string>('');
  placeholder = input<string>('••••••••');
  
  iconStart = input<string>('');
  size = input<'s' | 'm' | 'l'>('s');
  
  inputId = input<string>(`vtx-pwd-${crypto.randomUUID().substring(0, 8)}`);
}