import { Injectable, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiFeedbackService {
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);


    // --- Loader State Management ---
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.loadingSubject.asObservable();

    showLoader() {
        this.loadingSubject.next(true);
    }

    hideLoader() {
        this.loadingSubject.next(false);
    }
    
    showSuccess(successMsg: string) {
        this.messageService.add({ severity: 'success', detail: successMsg });
    }

    showInfo(infoMsg: string) {
        this.messageService.add({ severity: 'info', detail: infoMsg });
    }

    showWarn(warningMsg: string) {
        this.messageService.add({ severity: 'warn', detail: warningMsg });
    }

    showError(errorMsg: string) {
        this.messageService.add({ severity: 'error', detail: errorMsg });
    }

    showContrast(contrastMsg: string) {
        this.messageService.add({ severity: 'contrast', detail: contrastMsg });
    }

    showSecondary(secondaryMsg: string) {
        this.messageService.add({ severity: 'secondary', detail: secondaryMsg });
    }

    /**
     * Triggers a localized PrimeNG ConfirmPopup attached to the click event target.
     * 
     * @param event The native DOM click event (used to anchor the popup to the button)
     * @param itemName The name of the item being deleted (e.g., 'Dealer Name')
     * @param acceptCallback The function to execute if the user confirms the action
     */
    confirmDelete(itemName: string, acceptCallback: () => void) {
        console.log('✅ Service was called for:', itemName); // <-- Add this
    this.confirmationService.confirm({
      header: 'Confirm Deletion', 
      message: `Are you sure you want to delete ${itemName}?`,
      icon: 'pi pi-exclamation-triangle text-red-500',
      
      // V18 NEW WAY: Use Button Props instead of style classes
      acceptButtonProps: {
          label: 'Delete',
          severity: 'danger'
      },
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true
      },
      
      accept: () => acceptCallback()
    });
  }
}