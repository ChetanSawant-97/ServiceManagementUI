import { Routes } from '@angular/router';

export const salesRoutes: Routes = [
    {
        path: 'personal',
        loadComponent: () => import('./sales-personnel/sales-personnel').then(m => m.SalesPersonnel),
    },
    {
        path: 'designation',
        loadComponent: () => import('./designation/designation').then(m => m.Designation),
    }
];