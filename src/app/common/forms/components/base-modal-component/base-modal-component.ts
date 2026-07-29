import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-base-modal-component',
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './base-modal-component.html',
  styleUrl: './base-modal-component.scss',
})
export class BaseModalComponent {
  // Inputs & Writable Model for native two-way binding
  header = input<string>('Modal Header');
  visible = model.required<boolean>();
  style = input<{ [key: string]: string }>({ width: '45rem' });
  breakpoints = input<{ [key: string]: string }>({ '960px': '75vw', '640px': '95vw' });
  dismissableMask = input<boolean>(true);
  closable = input<boolean>(true);
  
  showDefaultFooter = input<boolean>(true);
  cancelLabel = input<string>('Cancel');
  confirmLabel = input<string>('Save');
  loading = input<boolean>(false);

  // Outputs
  cancel = output<void>();
  confirm = output<void>();

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}