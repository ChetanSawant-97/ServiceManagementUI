import { Component, input, OnDestroy, effect, untracked } from '@angular/core';
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
export class InputPasswordComponent implements OnDestroy {
  control = input.required<FormControl>();
  
  allowAutofill = input<boolean>(false); 
  requireConfirm = input<boolean>(false);
  showFeedback = input<boolean>(false);
  label = input<string>('Password');
  
  // FIX 2: Changed from literal dots to standard text to prevent the "grey dot" visual glitch
  placeholder = input<string>('Enter password');
  
  iconStart = input<string>('');
  size = input<'s' | 'm' | 'l'>('s');
  
  inputId = input<string>(`vtx-pwd-${crypto.randomUUID().substring(0, 8)}`);
  confirmInputId = `vtx-pwd-conf-${crypto.randomUUID().substring(0, 8)}`;

  confirmControl = new FormControl('');
  private valueSub?: Subscription;

  constructor() {
    effect(() => {
      const isRequired = this.requireConfirm();
      const parentControl = this.control();

      untracked(() => {
        if (isRequired) {
          parentControl.addValidators(this.customMatchValidator);
          
          this.valueSub = this.confirmControl.valueChanges.subscribe(() => {
            parentControl.updateValueAndValidity({ emitEvent: true });
          });
        } else {
          parentControl.removeValidators(this.customMatchValidator);
          // FIX 1B: Emit event is TRUE so the parent form's valueChanges fires and clears the error array!
          parentControl.updateValueAndValidity({ emitEvent: true }); 
          this.valueSub?.unsubscribe();
        }
      });
    });
  }

  private customMatchValidator: ValidatorFn = (control: AbstractControl) => {
    // FIX 1A: Absolute safeguard. If the signal says false, immediately pass validation.
    // This prevents race conditions during patchValue.
    if (!this.requireConfirm()) {
      return null;
    }

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
    
    return null;
  };

  ngOnDestroy() {
    this.valueSub?.unsubscribe();
    this.control().removeValidators(this.customMatchValidator);
    this.control().updateValueAndValidity({ emitEvent: false });
  }
}