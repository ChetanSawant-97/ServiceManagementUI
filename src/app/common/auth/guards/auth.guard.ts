import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/Authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  // 2. (Optional) Check for required roles
  // You can define required roles in your routing module like: 
  // data: { roles: ['admin', 'sales'] }
  // const requiredRoles = route.data['roles'] as Array<string>;
  
  // if (requiredRoles && requiredRoles.length > 0) {
  //   const userRole = authService.getRole();
    
  //   // If the user's role isn't in the list of allowed roles for this route
  //   if (!userRole || !requiredRoles.includes(userRole)) {
  //     // Redirect to an unauthorized page or dashboard
  //     return router.createUrlTree(['/unauthorized']); 
  //   }
  // }

  return true;
};