import { Component, computed, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-input-select',
  imports: [ReactiveFormsModule, Select, CommonModule,ButtonModule],
  templateUrl: './input-select.html',
  styleUrl: './input-select.scss',
})
export class SelectComponent {
  private readonly bp = inject(BreakpointObserver);

  control = input.required<FormControl>();
  items = input<any[]>([]);
  label = input<string>('');
  labelStyleClasses = input<string>('');
  placeholder = input<string>('');
  size = input<'s' | 'm' | 'l'>('s'); 
  
  selectId = input<string>(`vtx-select-${crypto.randomUUID().substring(0, 8)}`);

  protected readonly isMobile = toSignal(
    this.bp.observe('(max-width: 639px)').pipe(map(r => r.matches)),
    { initialValue: typeof window !== 'undefined' ? window.innerWidth < 640 : false }
  );

  // Maps your 's' size or mobile state directly to PrimeNG's native "small" size variant
  protected readonly primeSize = computed(() => {
    if (this.isMobile() || this.size() === 's') return 'small';
    if (this.size() === 'l') return 'large';
    return undefined;
  });
}