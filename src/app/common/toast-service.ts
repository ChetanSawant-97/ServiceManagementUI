import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
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

    // --- Toast Management ---
    showSuccess(successMsg: string, summary: string = 'Success') {
        this.messageService.add({ severity: 'success', summary, detail: successMsg });
    }

    showInfo(infoMsg: string, summary: string = 'Info') {
        this.messageService.add({ severity: 'info', summary, detail: infoMsg });
    }

    showWarn(warningMsg: string, summary: string = 'Warning') {
        this.messageService.add({ severity: 'warn', summary, detail: warningMsg });
    }

    showError(errorMsg: string, summary: string = 'Error') {
        this.messageService.add({ severity: 'error', summary, detail: errorMsg });
    }

    showContrast(contrastMsg: string, summary: string = 'Contrast') {
        this.messageService.add({ severity: 'contrast', summary, detail: contrastMsg });
    }

    showSecondary(secondaryMsg: string, summary: string = 'Secondary') {
        this.messageService.add({ severity: 'secondary', summary, detail: secondaryMsg });
    }
}