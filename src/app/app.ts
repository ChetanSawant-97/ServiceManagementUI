import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Import the standalone components directly
import { BlockUI } from 'primeng/blockui';
import { ThemeService } from './common/home/services/theme-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Toast } from 'primeng/toast';
import { UiFeedbackService } from './common/UiFeedbackService.service';
import { AsyncPipe } from '@angular/common';
import { ConfirmDialog } from 'primeng/confirmdialog'; // New v18 Standalone

@Component({
  selector: 'app-root',
  imports: [
    Toast, 
    RouterOutlet,
    BlockUI,           // 2. Add them to your imports array
    ProgressSpinnerModule,
    AsyncPipe,
    ConfirmDialog
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private themeService = inject(ThemeService);
  readonly currentTheme = this.themeService.currentTheme;
  public uiFeedbackService = inject(UiFeedbackService);
}