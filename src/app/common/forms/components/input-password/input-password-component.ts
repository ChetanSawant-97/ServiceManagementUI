import { Component, input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordModule],
  templateUrl: './input-password-component.html',
  styleUrl: './input-password-component.scss',
})
export class InputPasswordComponent implements OnInit, OnDestroy {
  control = input.required<FormControl>();
  
  requireConfirm = input<boolean>(false);
  showFeedback = input<boolean>(false);
  label = input<string>('Password');
  placeholder = input<string>('••••••••');
  iconStart = input<string>('');
  size = input<'s' | 'm' | 'l'>('s');
  
  inputId = input<string>(`vtx-pwd-${crypto.randomUUID().substring(0, 8)}`);
  confirmInputId = `vtx-pwd-conf-${crypto.randomUUID().substring(0, 8)}`;

  confirmControl = new FormControl('');
  private valueSub?: Subscription;

  ngOnInit() {
    if (this.requireConfirm()) {
      // 1. Attach our custom validator directly to the parent's control
      this.control().addValidators(this.customMatchValidator);

      // 2. When the user types in the confirm box, force the primary control to re-validate.
      // This automatically triggers valueChanges, which bubbles up to your dealerForm!
      this.valueSub = this.confirmControl.valueChanges.subscribe(() => {
        this.control().updateValueAndValidity({ emitEvent: true });
      });
    }
  }

  // The custom validator function
  private customMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const primary = control.value;
    const confirm = this.confirmControl.value;

    if (primary) {
      if (!confirm) {
        return { confirmRequired: true };
      }
      if (primary !== confirm) {
        return { passwordMismatch: true };
      }
    }
    
    return null; // Null means valid!
  };

  ngOnDestroy() {
    this.valueSub?.unsubscribe();
    
    // Clean up the validator when the component is destroyed
    if (this.requireConfirm()) {
      this.control().removeValidators(this.customMatchValidator);
      this.control().updateValueAndValidity({ emitEvent: false });
    }
  }
}