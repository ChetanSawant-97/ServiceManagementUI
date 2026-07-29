import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Import the standalone components directly
import { BlockUI } from 'primeng/blockui';
import { ThemeService } from './common/home/services/theme-service';
import { UiService } from './common/UiUtility.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    BlockUI,           // 2. Add them to your imports array
    ProgressSpinnerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private themeService = inject(ThemeService);
  readonly currentTheme = this.themeService.currentTheme;
  public uiUtilityService = inject(UiService);
}