import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Import the standalone components directly
import { BlockUI } from 'primeng/blockui';
import { ThemeService } from './common/home/services/theme-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Toast } from 'primeng/toast';
import { ToastService } from './common/toast-service';
import { AsyncPipe } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [
    Toast, 
    RouterOutlet,
    BlockUI,           // 2. Add them to your imports array
    ProgressSpinnerModule,
    AsyncPipe,
    ConfirmPopupModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers : [ConfirmationService]
})
export class App {
  private themeService = inject(ThemeService);
  readonly currentTheme = this.themeService.currentTheme;
  public toastService = inject(ToastService);
}