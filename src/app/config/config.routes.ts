import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'products',
        loadComponent: () => import('./components/product-master/product-master').then(m => m.ProductMaster)
    },
    {
        path: 'tripDetails',
        loadComponent: () => import('./components/trip-master/trip-master').then(m => m.TripMaster),
    },
];