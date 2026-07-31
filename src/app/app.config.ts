import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { MessageService } from 'primeng/api'; // <-- Import MessageService

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
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: VortrixPreset,
                options: {
                    darkModeSelector: "[data-theme='dark']"
                }
            }
        }),
        MessageService
    ]
};