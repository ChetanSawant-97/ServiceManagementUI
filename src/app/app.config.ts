import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { ConfirmationService, MessageService } from 'primeng/api'; // <-- Import MessageService
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './common/auth/Auth.interceptor';

const VortrixPreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
            light: {
                formField: {
                    background: 'var(--bg-2)',
                    borderColor: 'var(--line)',
                    color: 'var(--ink)',
                    hoverBorderColor: 'var(--mint)',
                    focusBorderColor: 'var(--mint)'
                }
            },
            dark: {
                formField: {
                    background: 'var(--bg-2)',
                    borderColor: 'var(--line)',
                    color: 'var(--ink)',
                    hoverBorderColor: 'var(--mint)',
                    focusBorderColor: 'var(--mint)'
                }
            }
        }
    }
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptorsFromDi()), 
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        providePrimeNG({
            theme: {
                preset: VortrixPreset,
                options: {
                    darkModeSelector: "[data-theme='dark']"
                }
            }
        }),
        MessageService,
        ConfirmationService,
    ]
};