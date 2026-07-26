import { Component, computed, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiIcon, TuiInputDirective, TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-input-password',
  imports: [ReactiveFormsModule, TuiTextfield, TuiInputDirective, TuiIcon],
  templateUrl: './input-password-component.html',
  styleUrl: './input-password-component.scss',
})
export class InputPasswordComponent {
  // Standard inputs mapped from your text component
  control = input.required<FormControl>();
  label = input<string>('');
  placeholder = input<string>('••••••••');
  
  iconStart = input<string>('');
  size = input<'s' | 'm' | 'l'>('s');
  
  inputId = input<string>(`vtx-pwd-${crypto.randomUUID().substring(0, 8)}`);

  // Local state for the show/hide toggle
  showPassword = signal<boolean>(false);
  
  // Dynamically changes the input type based on the toggle state
  currentType = computed(() => this.showPassword() ? 'text' : 'password');

  togglePassword(): void {
    this.showPassword.update(state => !state);
  }
}
