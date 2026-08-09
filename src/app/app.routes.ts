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
                path : 'config',
                loadChildren: () => import('./config/config.routes').then(m => m.routes)
            },
            {
                path : 'sales',
                loadChildren: () => import('./sales/sales.routes').then(m => m.salesRoutes)
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