import { Component, computed, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

// 1. Alias the PrimeNG import to avoid colliding with your class name
import { InputText as PrimeInputText } from 'primeng/inputtext';

@Component({
  selector: 'app-input-text',
  // 2. Use the aliased import here
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
  
  // Supports standard text, email, tel, password, number, etc.
  type = input<string>('text');
  
  // Optional explicit overrides if needed
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
    { initialValue: window.innerWidth < 640 }
  );

  // Automatically configure best mobile keyboard and properties based on type
  protected readonly resolvedType = computed(() => {
    const t = this.type().toLowerCase();
    if (t === 'mobile' || t === 'phone') return 'tel';
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
}