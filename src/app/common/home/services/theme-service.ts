import { Service, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Service()
export class ThemeService {
  // Always initializes with the default light theme
  readonly currentTheme = signal<ThemeMode>('light');

  // Toggle helper method
  toggleTheme(): void {
    this.currentTheme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }

  // Set specific theme
  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
  }
}


