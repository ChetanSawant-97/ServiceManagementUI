import { Component, computed, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

import { InputText as PrimeInputText } from 'primeng/inputtext';

// 1. Define the allowed input types strictly
export type InputFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'mobile' 
  | 'phone' 
  | 'tel' 
  | 'alphanumeric';

@Component({
  selector: 'app-input-text',
  imports: [ReactiveFormsModule, CommonModule, PrimeInputText],
  templateUrl: './input-text.html',
  styleUrl: './input-text.scss'
})
export class InputText {
  private readonly bp = inject(BreakpointObserver);

  control = input.required<FormControl>();
  label = input<string>('');
  labelStyleClasses = input<string>('');
  placeholder = input<string>('');
  
  // 2. Apply the interface to the type input
  type = input<InputFieldType>('text');
  
  inputMode = input<string>('');
  autoComplete = input<string>('');
  maxLength = input<number | null>(null);
  pattern = input<string>('');
  
  iconStart = input<string>('');
  iconEnd = input<string>('');
  size = input<'s' | 'm' | 'l'>('s');
  
  inputId = input<string>(`vtx-input-${crypto.randomUUID().substring(0, 8)}`);

  protected readonly isMobile = toSignal(
    this.bp.observe('(max-width: 639px)').pipe(map(r => r.matches)),
    { initialValue: typeof window !== 'undefined' ? window.innerWidth < 640 : false }
  );

  protected readonly resolvedType = computed(() => {
    const t = this.type().toLowerCase();
    if (t === 'mobile' || t === 'phone') return 'tel';
    
    // Fallbacks to standard 'text' so maxLength and custom filtering works natively
    if (t === 'number' || t === 'alphanumeric') return 'text'; 
    
    return t;
  });

  protected readonly resolvedInputMode = computed(() => {
    if (this.inputMode()) return this.inputMode();
    const t = this.type().toLowerCase();
    
    if (t === 'email') return 'email';
    if (t === 'tel' || t === 'mobile' || t === 'phone') return 'tel';
    if (t === 'number') return 'numeric';
    
    return 'text'; 
  });

  protected readonly resolvedAutocomplete = computed(() => {
    if (this.autoComplete()) return this.autoComplete();
    const t = this.type().toLowerCase();
    
    if (t === 'email') return 'email';
    if (t === 'tel' || t === 'mobile' || t === 'phone') return 'tel';
    
    return 'off';
  });

  protected onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const t = this.type().toLowerCase();
    
    let sanitized = inputElement.value;

    if (t === 'mobile' || t === 'phone' || t === 'tel' || t === 'number') {
      sanitized = sanitized.replace(/\D/g, '');
    } else if (t === 'alphanumeric') {
      sanitized = sanitized.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    const max = this.maxLength();
    if (max && sanitized.length > max) {
      sanitized = sanitized.substring(0, max);
    }

    if (inputElement.value !== sanitized) {
      inputElement.value = sanitized;
      this.control().setValue(sanitized, { emitEvent: false });
    }
  }
}