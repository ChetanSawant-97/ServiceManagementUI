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
  
  // NEW: Flag to control autofill (Defaults to false for create/register pages)
  allowAutofill = input<boolean>(false); 

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
      this.control().addValidators(this.customMatchValidator);

      this.valueSub = this.confirmControl.valueChanges.subscribe(() => {
        this.control().updateValueAndValidity({ emitEvent: true });
      });
    }
  }

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
    
    return null;
  };

  ngOnDestroy() {
    this.valueSub?.unsubscribe();
    
    if (this.requireConfirm()) {
      this.control().removeValidators(this.customMatchValidator);
      this.control().updateValueAndValidity({ emitEvent: false });
    }
  }
}