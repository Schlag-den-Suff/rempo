import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockBackendService } from './mock-backend.service';

/**
 * AuthService provides user authentication and authorization functionality,
 * including login, registration, password management, and token handling.
 * This service handles operations such as logging in, logging out,
 * updating passwords, and token refresh for maintaining user sessions.
 * 
 * Currently uses MockBackendService to simulate Django backend.
 * To migrate to real Django backend:
 * 1. Remove MockBackendService injection
 * 2. Uncomment HTTP calls and use environment.apiUrl
 * 3. Update response handling if Django response format differs
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Base URL for user-related API endpoints
  private apiUrl = environment.apiUrl.concat('/user');

  // Token lifetime in milliseconds
  private TOKEN_LIFETIME = 3600 * 1000;
  private sessionTimeout: any;

  /**
   * Initializes the AuthService instance.
   * @param {HttpClient} http - The HTTP client for making HTTP requests.
   * @param {Router} router - The router service for navigation purposes.
   * @param {MatSnackBar} snackBar - The snack bar service for displaying notifications.
   * @param {MockBackendService} mockBackend - Mock backend service (temporary, for development)
   */
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private mockBackend: MockBackendService
  ) {}

  /**
   * Registers a new user with provided credentials.
   * @param userName - The username for registration.
   * @param eMail - The email address for registration.
   * @param password - The password for the new user.
   * @returns {Observable<any>} - An observable that resolves with the server response.
   */
  register(userName: string, eMail: string, password: string): Observable<any> {
    // Using mock backend for now
    return this.mockBackend.register(userName, eMail, password);
    
    // TODO: When Django backend is ready, replace above with:
    // return this.http.post<any>(
    //   `${this.apiUrl}/register`,
    //   { username: userName, email: eMail, password: password },
    //   {
    //     observe: 'response',
    //   }
    // );
  }

  /**
   * Logs in the user with provided credentials.
   * @param userName - The username for login.
   * @param password - The password for login.
   * @returns {Observable<any>} - An observable that resolves with the login response.
   */
  login(userName: string, password: string): Observable<any> {
    // Using mock backend for now
    return this.mockBackend.login(userName, password);
    
    // TODO: When Django backend is ready, replace above with:
    // return this.http.post<any>(
    //   `${this.apiUrl}/login`,
    //   { username: userName, password: password },
    //   {
    //     observe: 'response',
    //     responseType: 'json',
    //   }
    // );
  }

  /**
   * Logs the user out by removing stored tokens and redirecting to the home page.
   * @returns {Promise<void>} - A promise that navigates the user to the home page after logging out.
   */
  logout() {
    // Using mock backend for now
    this.mockBackend.logout(this.getId() || '').subscribe({
      next: () => {
        // Remove id, access and refresh tokens after successful logout
        localStorage.removeItem('id');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_issue_time');
        // Redirect to the landing page
        if (this.router.url === '/') {
          // Force page reload if already on
          window.location.reload();
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        // Display error message in case of logout failure
        this.snackBar.open('Es ist ein Fehler bei der Abmeldung aufgetreten.', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
    
    // TODO: When Django backend is ready, replace above with:
    // this.http
    //   .post<any>(
    //     `${this.apiUrl}/logout`,
    //     { id: this.getId() },
    //     {
    //       observe: 'response',
    //       responseType: 'json',
    //     }
    //   )
    //   .subscribe({
    //     next: () => {
    //       // Remove id, access and refresh tokens after successful logout
    //       localStorage.removeItem('id');
    //       localStorage.removeItem('access_token');
    //       localStorage.removeItem('refresh_token');
    //       localStorage.removeItem('token_issue_time');
    //       // Redirect to the landing page
    //       if (this.router.url === '/') {
    //         // Force page reload if already on
    //         window.location.reload();
    //       } else {
    //         this.router.navigate(['/']);
    //       }
    //     },
    //     error: () => {
    //       // Display error message in case of logout failure
    //       this.snackBar.open('Es ist ein Fehler bei der Abmeldung aufgetreten.', 'OK', {
    //         duration: 3000,
    //         horizontalPosition: 'center',
    //         verticalPosition: 'top',
    //       });
    //     },
    //   });
  }

  /**
   * Updates the user's password.
   * @param newPassword - The new password to set.
   * @param oldPassword - The current password for verification.
   * @returns {Observable<any>} - An observable with the server response.
   */
  updatePassword(newPassword: string, oldPassword: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/update_password`,
      {
        access: this.getAccessToken(),
        newPassword: newPassword,
        oldPassword: oldPassword,
      },
      {
        observe: 'response',
      }
    );
  }

  /**
   * Stores the provided access token and its issue time in local storage.
   * @param token - The access token to store.
   */
  storeAccessToken(token: string): void {
    const issueTime = Date.now();
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_issue_time', issueTime.toString());
  }

  /**
   * Checks if the stored access token has expired based on the token's issue time.
   * @returns {boolean} - True if the token is expired; otherwise, false.
   */
  isTokenExpired(): boolean {
    const issueTime = parseInt(localStorage.getItem('token_issue_time') || '0', 10);
    const currentTime = Date.now();
    return currentTime - issueTime > this.TOKEN_LIFETIME;
  }

  /**
   * Retrieves the stored access token from local storage.
   * @returns {string | null} - The access token or null if not found.
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Retrieves the stored refresh token from local storage.
   * @returns {string | null} - The refresh token or null if not found.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Requests a new access token using the stored refresh token.
   * @returns {Observable<any>} - An observable with the response containing the new access token.
   */
  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    // Using mock backend for now
    return this.mockBackend.refreshToken(refreshToken || '').pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
      })
    );
    
    // TODO: When Django backend is ready, replace above with:
    // return this.http
    //   .post<any>(`${this.apiUrl}/refresh_token/`, { refresh: refreshToken })
    //   .pipe(
    //     tap(response => {
    //       localStorage.setItem('access_token', response.access);
    //     })
    //   );
  }

  /**
   * Checks if the user is authenticated by verifying the presence of an access token
   * and ensuring it is not expired.
   * @returns {boolean} - True if the user is authenticated; otherwise, false.
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * Resets or starts a session timeout to log the user out after inactivity.
   * Displays a snackbar notification when the session expires and logs the user out.
   */
  resetSessionTimeout(): void {
    clearTimeout(this.sessionTimeout);
    this.sessionTimeout = setTimeout(
      () => {
        this.snackBar.open('Sitzung aufgrund von Inaktivität abgelaufen.', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        // Log the user out after session timeout
        this.logout();
      },
      // Set session timeout to 30 minutes
      30 * 60 * 1000
    );
  }

  /**
   * Retrieves the user's ID from local storage.
   * @returns {string | null} - The stored user ID or null if not found.
   */
  getId(): string | null {
    return localStorage.getItem('id');
  }
}
