import { Injectable, inject, signal } from '@angular/core';
import { TuiNotificationService } from '@taiga-ui/core'; // <-- Import the new service

@Injectable({
  providedIn: 'root'
})
export class UiService {
    
  private readonly alertService = inject(TuiNotificationService); // <-- Inject the new service

  public readonly isGlobalLoading = signal<boolean>(false);

  public showLoader(): void {
    this.isGlobalLoading.set(true);
  }

  public hideLoader(): void {
    this.isGlobalLoading.set(false);
  }

  public showSuccess(message: string, label: string = 'Success'): void {
    this.alertService.open(message, { 
      label, 
      appearance: 'positive', // <-- 'positive' triggers the GREEN theme
      autoClose: 3000,
      icon: '@tui.check.circle'
    }).subscribe();
  }

  public showError(message: string, label: string = 'Error'): void {
    this.alertService.open(message, { 
      label, 
      appearance: 'negative', // <-- 'negative' triggers the RED theme
      autoClose: 5000,
      icon: '@tui.alert.circle'
    }).subscribe();
  }

  public showWarning(message: string, label: string = 'Warning'): void {
    this.alertService.open(message, { 
      label, 
      appearance: 'warning', // <-- 'warning' triggers the YELLOW theme
      autoClose: 4000,
      icon: '@tui.triangle.alert'
    }).subscribe();
  }

  public showInfo(message: string, label: string = 'Info'): void {
    this.alertService.open(message, { 
      label, 
      appearance: 'info', // <-- 'info' triggers the BLUE theme
      autoClose: 3000,
      icon: '@tui.info'
    }).subscribe();
  }
}