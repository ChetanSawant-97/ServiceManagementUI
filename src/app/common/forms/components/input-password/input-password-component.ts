import { Component, input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { merge, Subscription } from 'rxjs';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordModule],
  templateUrl: './input-password-component.html',
  styleUrl: './input-password-component.scss',
})
export class InputPasswordComponent implements OnInit, OnDestroy {
  control = input.required<FormControl>();
  
  // Flag to toggle the second confirm field
  requireConfirm = input<boolean>(false);
  
  label = input<string>('Password');
  placeholder = input<string>('••••••••');
  iconStart = input<string>('');
  size = input<'s' | 'm' | 'l'>('s');
  
  inputId = input<string>(`vtx-pwd-${crypto.randomUUID().substring(0, 8)}`);
  confirmInputId = `vtx-pwd-conf-${crypto.randomUUID().substring(0, 8)}`;

  // Local control for the confirm field
  confirmControl = new FormControl('');
  private valueSub?: Subscription;

  ngOnInit() {
    if (this.requireConfirm()) {
      // Listen to changes on BOTH fields to check for matches
      this.valueSub = merge(
        this.control().valueChanges,
        this.confirmControl.valueChanges
      ).subscribe(() => this.validateMatch());
    }
  }

  private validateMatch() {
    const primary = this.control().value;
    const confirm = this.confirmControl.value;
    const currentErrors = this.control().errors || {};

    if (primary !== confirm) {
      // Push custom error to the parent's control
      this.control().setErrors({ ...currentErrors, passwordMismatch: true });
    } else {
      // Remove only our custom error if they match
      delete currentErrors['passwordMismatch'];
      this.control().setErrors(Object.keys(currentErrors).length ? currentErrors : null);
    }
  }

  ngOnDestroy() {
    this.valueSub?.unsubscribe();
  }
}