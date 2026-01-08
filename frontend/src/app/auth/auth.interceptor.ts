import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * An HTTP interceptor that adds an authorization header to outgoing HTTP requests
 * to attach an authorization token. It handles token expiration and automatically
 * attempts to refresh the token if a 401 Unauthorized response is received.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Constructs an instance of AuthInterceptor.
   * @param {AuthService} authService - The service responsible for managing user authentication
   * and token handling.
   *
   * Change History:
   *  - Version 1.0.0 (30.10.2024): Initial creation of AuthInterceptor by Merve Dag.
   */
  constructor(private authService: AuthService) {}

  /**
   * Intercepts and modifies outgoing HTTP requests by adding an authorization token
   * and handling cases where the token is expired by attempting to refresh it.
   * @param {HttpRequest<unknown>} request - The HTTP request being intercepted.
   * @param {HttpHandler} next - The next handler in the HTTP interceptor chain.
   * @returns {Observable<HttpEvent<unknown>>} - An observable that represents the response or error
   * after processing the request.
   *
   * @version 1.1
   *
   * Change History:
   *  - Version 1.0 (30.10.2024): Initial creation by Merve Dag.
   *  - Version 1.1 (30.11.2024): Adding the resetSessionTimeout by Merve Dag
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Retrieve the stored access token from the AuthService
    const accessToken = this.authService.getAccessToken();

    // If an access token exists, attach it to the request's headers
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    // Refresh session timeout to keep the user's session active
    this.authService.resetSessionTimeout();

    // Pass the request to the next handler in the chain and handle potential errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors and check for a refresh token
        if (error.status === 401 && this.authService.getRefreshToken()) {
          // Attempt to refresh the token if available
          return this.authService.refreshAccessToken().pipe(
            switchMap(response => {
              // Clone the original request and set the new access token
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.access}`,
                },
              });
              // Retry the original request with the updated token
              return next.handle(request);
            }),
            catchError(err => {
              // If refreshing the token fails, log out the user and redirect them to login
              this.authService.logout();
              return throwError(() => err);
            })
          );
        }
        // If not a 401 error or token refresh fails, propagate the original error
        return throwError(() => error);
      })
    );
  }
}

/**
 * Provides the AuthInterceptor for the HTTP interceptor chain, ensuring that
 * it is included in Angular's HTTP request handling.
 *
 * @version 1.0
 *
 * Change History:
 *  - Version 1.0 (30.10.2024): Initial creation of the apiProvider by Merve Dag.
 */
export const apiProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
