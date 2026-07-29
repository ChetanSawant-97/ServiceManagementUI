import { Component, inject, input } from '@angular/core';
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
  type = input<string>('text');
  
  iconStart = input<string>('');
  iconEnd = input<string>('');
  size = input<'s' | 'm' | 'l'>('s');
  
  inputId = input<string>(`vtx-input-${crypto.randomUUID().substring(0, 8)}`);

  protected readonly isMobile = toSignal(
    this.bp.observe('(max-width: 639px)').pipe(map(r => r.matches)),
    { initialValue: window.innerWidth < 640 }
  );
}