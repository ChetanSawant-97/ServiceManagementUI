import { Routes } from '@angular/router';
import { authGuard } from './common/auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./common/auth/components/staff-login/staff-login').then(m => m.StaffLogin)
    },
    {
        path: '',
        canActivate: [authGuard], 
        loadComponent: () => import('./common/home/components/app-shell/app-shell').then(m => m.AppShell),
        children : [
            {
                path : 'dashboard',
                loadComponent: () => import('./common/home/components/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path : 'sales',
                loadComponent: () => import('./sales/sales-personnel/sales-personnel').then(m => m.SalesPersonnel)
            },
            {
                path : 'designaion', 
                loadComponent: () => import('./sales/designation/designation').then(m => m.Designation)
            },
            {
                path : 'tripDetails',
                loadComponent: () => import('./sales/trip-details/trip-details').then(m => m.TripDetails)
            },
            {
                path : 'orders',
                loadComponent: () => import('./orders/orders-management/orders-management').then(m => m.OrdersManagement)
            },
            {
                path : 'dealer',
                loadComponent: () => import('./dealer/dealer-management/dealer-management').then(m => m.DealerManagement)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];