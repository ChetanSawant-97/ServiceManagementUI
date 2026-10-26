import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputText } from '../../../common/forms/components/input-text/input-text';
import { BranchManagerService } from '../../services/barcn-manager.service';
import { InputPasswordComponent } from '../../../common/forms/components/input-password/input-password-component';
import { getFormErrorMessages } from '../../../common/Utility';

@Component({
  selector: 'app-areas-component',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputText,InputPasswordComponent],
  templateUrl: './branch-manager-component.html',
  styleUrl: './branch-manager-component.scss',
})
export class BranchManagerComponent {
  private branchManagerService = inject(BranchManagerService);

  public isSaving = false;

  // Strongly typed FormGroup exactly like in SalesPersonnel
  public managerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // Reusing your unified error messaging system
  get currentFormError(): string {
    const errors = getFormErrorMessages(this.managerForm, {
      username: 'Login Username',
      password: 'Login Password'
    });
    return errors.length > 0 ? errors[0] : '';
  }

  saveManager(): void {
    if (this.managerForm.invalid) {
      this.managerForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    
    // Safely extract values since they are strongly typed
    const formValues = this.managerForm.getRawValue();
    const payload = {
      username: formValues.username ?? '',
      password: formValues.password ?? ''
    };

    this.branchManagerService.createBranchManager(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.clearForm();
        }
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  clearForm(): void {
    this.managerForm.reset({
      username: '',
      password: ''
    });
  }
}
