import { Component, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiInputDirective, TuiTextfield } from '@taiga-ui/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-input-text',
  imports: [ReactiveFormsModule, TuiTextfield, TuiInputDirective],
  templateUrl: './input-text.html',
  styleUrl: './input-text.scss'
})
export class InputText {
  private readonly bp = inject(BreakpointObserver);

  control = input.required<FormControl>();
  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  
  // New inputs for icons and sizing based on Taiga UI v5 specs
  iconStart = input<string>('');
  iconEnd = input<string>('');
  size = input<'s' | 'm' | 'l'>('s');
  
  inputId = input<string>(`vtx-input-${crypto.randomUUID().substring(0, 8)}`);


  

  protected readonly isMobile = toSignal(
    this.bp.observe('(max-width: 639px)').pipe(map(r => r.matches)),
    { initialValue: window.innerWidth < 640 }
  );

}