import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../services/Token.service'; // Adjust path if needed

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // 1. Check if the user is authenticated
  if (!tokenService.isLoggedIn()) {
    // Redirect to login if they don't have a valid token
    return router.createUrlTree(['/login']);
  }

  // 2. Check for required roles (Uncommented and fixed)
  // Get the roles defined in the route data, e.g., data: { roles: ['admin', 'sales'] }
  const requiredRoles = route.data['roles'] as Array<string>;
  
  if (requiredRoles && requiredRoles.length > 0) {
    // Retrieve the current user's role from localStorage via TokenService
    const currentUser = tokenService.getUserData();
    const userRole = currentUser?.role;
    
    // If the user's role isn't in the list of allowed roles for this route
    if (!userRole || !requiredRoles.includes(userRole)) {
      // Redirect to an unauthorized/access-denied page
      return router.createUrlTree(['/unauthorized']); 
    }
  }

  // User is logged in and has the correct role, grant access!
  return true;
};