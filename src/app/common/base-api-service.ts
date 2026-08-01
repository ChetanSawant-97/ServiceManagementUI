import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UiFeedbackService } from './UiFeedbackService.service';
import { EndpointConfig } from './ApiConstants';
// Import your updated ToastService

export interface RequestOptions {
  pathParams?: Record<string, string | number>;
  showLoader?: boolean;       // Default is true, set to false for silent background requests
  successMessage?: string;    // If provided, automatically pops a success toast
}

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  // Using inject() keeps the constructor clean
  private http = inject(HttpClient);
    private uiFeedbackService = inject(UiFeedbackService);

  request<TResponse, TBody = unknown>(
    config: EndpointConfig,
    body?: TBody,
    options: RequestOptions = {}
  ): Observable<TResponse> {
    
    // Default showLoader to true unless explicitly passed as false
    const shouldShowLoader = options.showLoader !== false;

    // 1. Show loader before the request starts
    if (shouldShowLoader) {
      this.uiFeedbackService.showLoader();
    }

    // 2. Format URL
    let finalUrl = `${environment.apiUrl}/${config.url}`;
    if (options.pathParams) {
      for (const [key, value] of Object.entries(options.pathParams)) {
        finalUrl = finalUrl.replace(`{${key}}`, String(value));
      }
    }
    // ADD THESE TWO LINES:
    console.log('1. ENVIRONMENT OBJECT:', environment);
    console.log('2. FINAL URL:', finalUrl);
    // 3. Execute request and attach RxJS lifecycle hooks
    return this.http.request<TResponse>(config.method, finalUrl, { body }).pipe(
      
      // Handle Success
      tap(() => {
        if (options.successMessage) {
          this.uiFeedbackService.showSuccess(options.successMessage);
        }
      }),

      // Handle Error
      catchError((error: HttpErrorResponse) => {
        // Extract the error message from your microservice backend, or use a fallback
        const errorMsg = error.error?.message || 'An unexpected error occurred.';
        this.uiFeedbackService.showError(errorMsg);
        
        return throwError(() => error);
      }),

      // Finalize runs ALWAYS (whether the request succeeded or failed)
      finalize(() => {
        if (shouldShowLoader) {
          this.uiFeedbackService.hideLoader();
        }
      })
    );
  }
}