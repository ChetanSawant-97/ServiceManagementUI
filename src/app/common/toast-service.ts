import { Injectable, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    private messageService = inject(MessageService);

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
}