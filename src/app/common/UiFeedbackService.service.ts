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

    // 💡 Tailwind classes to perfectly center the icon, text, and close button, 
    // while hiding the empty summary div that causes vertical offset.
    private readonly toastContentClass = 'flex items-start md:items-center gap-2 md:gap-3 text-sm md:text-base [&_.p-toast-message-text]:flex-1 [&_.p-toast-summary]:hidden [&_.p-toast-message-icon]:text-lg md:[&_.p-toast-message-icon]:text-xl';
    
    showLoader() {
        this.loadingSubject.next(true);
    }

    hideLoader() {
        this.loadingSubject.next(false);
    }
    
    showSuccess(successMsg: string) {
        this.messageService.add({ 
            severity: 'success', 
            detail: successMsg, 
            contentStyleClass: this.toastContentClass 
        });
    }

    showInfo(infoMsg: string) {
        this.messageService.add({ 
            severity: 'info', 
            detail: infoMsg, 
            contentStyleClass: this.toastContentClass 
        });
    }

    showWarn(warningMsg: string) {
        this.messageService.add({ 
            severity: 'warn', 
            detail: warningMsg, 
            contentStyleClass: this.toastContentClass 
        });
    }

    showError(errorMsg: string) {
        this.messageService.add({ 
            severity: 'error', 
            detail: errorMsg, 
            contentStyleClass: this.toastContentClass 
        });
    }

    showContrast(contrastMsg: string) {
        this.messageService.add({ 
            severity: 'contrast', 
            detail: contrastMsg, 
            contentStyleClass: this.toastContentClass 
        });
    }

    showSecondary(secondaryMsg: string) {
        this.messageService.add({ 
            severity: 'secondary', 
            detail: secondaryMsg, 
            contentStyleClass: this.toastContentClass 
        });
    }

    confirmDelete(itemName: string, acceptCallback: () => void) {
        console.log('✅ Service was called for:', itemName);
        this.confirmationService.confirm({
            header: '', 
            closable: false,
            message: `Are you sure you want to delete ${itemName}?`,
            icon: 'pi pi-exclamation-triangle text-red-500',
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