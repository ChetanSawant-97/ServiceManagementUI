import { Component, input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-date',
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule],
  templateUrl: './input-date-component.html',
  styleUrl: './input-date-component.scss',
})
export class InputDateComponent implements OnInit, OnDestroy {
  // Required form control from parent
  control = input.required<FormControl>();
  
  // Basic properties
  label = input<string>('');
  placeholder = input<string>('Select date');
  
  // Date constraints
  minDate = input<Date | undefined>(undefined);
  maxDate = input<Date | undefined>(undefined);
  
  // UI Configuration
  showIcon = input<boolean>(true);
  iconDisplay = input<'input' | 'button'>('input');
  
  // Dynamic ID generation for accessibility 
  inputId = input<string>(`vtx-date-${crypto.randomUUID().substring(0, 8)}`);

  // --- NEW: Internal control to handle Date object translation ---
  internalControl = new FormControl<Date | null>(null);
  private subs = new Subscription();

  ngOnInit() {
    // 1. Initial load (Translate Parent String -> UI Date)
    this.updateInternalFromParent(this.control().value);

    // 2. Listen to API/Parent changes (e.g. form.patchValue)
    this.subs.add(
      this.control().valueChanges.subscribe(val => {
        this.updateInternalFromParent(val);
      })
    );

    // 3. Listen to User UI changes (Translate UI Date -> Parent String)
    this.subs.add(
      this.internalControl.valueChanges.subscribe(val => {
        this.updateParentFromInternal(val);
      })
    );
  }

  // Translates "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm" to a safe JS Date object
  private updateInternalFromParent(val: any) {
    if (!val) {
      this.internalControl.setValue(null, { emitEvent: false });
      return;
    }
    
    if (val instanceof Date) {
      this.internalControl.setValue(val, { emitEvent: false });
      return;
    }
    
    if (typeof val === 'string') {
      // Extract just the YYYY-MM-DD part safely
      const datePart = val.substring(0, 10);
      const parts = datePart.split('-');
      
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        const day = parseInt(parts[2], 10);
        
        const parsedDate = new Date(year, month, day);
        
        // Prevent infinite loops by checking if the timestamp actually changed
        if (this.internalControl.value?.getTime() !== parsedDate.getTime()) {
          this.internalControl.setValue(parsedDate, { emitEvent: false });
        }
      }
    }
  }

  private updateParentFromInternal(val: Date | null) {
    if (!val) {
      this.control().setValue(null, { emitEvent: true });
      return;
    }

    const year = val.getFullYear();
    const month = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');
    const formattedString = `${year}-${month}-${day}`;
    
    // Check equality to prevent infinite loops
    if (this.control().value !== formattedString) {
      this.control().setValue(formattedString, { emitEvent: true });
      this.control().markAsDirty(); // Let parent know the user modified it
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}