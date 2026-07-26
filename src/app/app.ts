import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiLoader, TuiRoot } from '@taiga-ui/core';
import { ThemeService } from './common/home/services/theme-service';
import { UiService } from './common/UiUtility.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,TuiRoot,TuiLoader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  private themeService = inject(ThemeService);
  
  // Expose the signal to your HTML template
  readonly currentTheme = this.themeService.currentTheme;

  public uiUtilityService = inject(UiService);

}
