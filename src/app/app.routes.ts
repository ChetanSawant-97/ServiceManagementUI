import { Routes } from '@angular/router';
import { authGuard } from './common/auth/guards/auth.guard';
import { Dashboard } from './common/home/components/dashboard/dashboard';
import { SalesPersonnel } from './sales/sales-personnel/sales-personnel';
import { Designation } from './sales/designation/designation';
import { TripDetails } from './sales/trip-details/trip-details';
import { OrdersManagement } from './orders/orders-management/orders-management';
import { DealerManagement } from './dealer/dealer-management/dealer-management';

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
                path : '',
                component : Dashboard,
            },
            {
                path : 'sales',
                component : SalesPersonnel
            },
            {
                path : 'designaion',
                component :Designation
            },
            {
                path : 'tripDetails',
                component : TripDetails
            },
            {
                path : 'orders',
                component : OrdersManagement
            },
            {
                path : 'dealer',
                component : DealerManagement
            }
        ]
    },
    {
        // Catch-all route: Redirects any unknown URLs to the login page
        path: '**',
        redirectTo: ''
    }
];
