import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Angular route guard that is responsible for protecting routes by ensuring that only authenticated users can access them.
 * If a user is not authenticated, they will be redirected to the login page.
 * Additionally, this guard resets the session timeout on each route activation to maintain session activity.
 *
 * The guard checks the user's authentication status via the AuthService and handles navigation and user feedback using the Router and MatSnackBar services.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   * Constructs an instance of the AuthGuard service.
   * @param {AuthService} authService - The service that handles user authentication logic.
   * @param {Router} router - The Angular router service used for navigation.
   * @param {MatSnackBar} snackBar - The Angular Material service to display notifications.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  /**
   * This method determines whether the route can be activated.
   * It checks if the user is authenticated, and if not, redirects them to the login page.
   * If the navigation fails, a snackbar notification is shown to the user.
   * @returns {boolean} - Returns `true` if the user is authenticated; otherwise, `false`.
   */
  canActivate(): boolean {
    // Refresh session timeout on route activation
    this.authService.resetSessionTimeout();

    // Check if the user is authenticated based on the presence of a valid access token
    if (!this.authService.isAuthenticated()) {
      // Redirect the user to the login page if not authenticated
      this.router.navigate(['/login']).catch(() => {
        // Show an error notification if navigation fails
        this.snackBar.open("Navigation zu 'Login' ist fehlgeschlagen", 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
      // Deny access to the route
      return false;
    }
    // Allow access to the route if the user is authenticated
    return true;
  }
}
