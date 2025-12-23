import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * MockBackendService simulates Django backend API responses
 * This service will be replaced with actual HTTP calls when the Django backend is ready
 */
@Injectable({
  providedIn: 'root'
})
export class MockBackendService {
  // In-memory storage for mock users
  private users: Array<{ id: string; username: string; email: string; password: string }> = [
    {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }
  ];

  constructor() {}

  /**
   * Mock login endpoint - simulates Django's token-based authentication
   * @param username - The username
   * @param password - The password
   * @returns Observable with mock response
   */
  login(username: string, password: string): Observable<any> {
    // Simulate network delay
    return of(null).pipe(
      delay(500),
      // After delay, check credentials
      switchMap(() => {
        const user = this.users.find(u => u.username === username);
        
        if (!user) {
          return throwError(() => ({ error: 'userNameNotRegistered' }));
        }
        
        if (user.password !== password) {
          return throwError(() => ({ error: 'passwordOrUserNameWrong' }));
        }

        // Return mock JWT tokens (similar to Django JWT structure)
        return of({
          status: 200,
          body: {
            access: this.generateMockToken('access'),
            refresh: this.generateMockToken('refresh'),
            id: user.id
          }
        });
      })
    );
  }

  /**
   * Mock register endpoint - simulates Django user registration
   * @param username - The username
   * @param email - The email
   * @param password - The password
   * @returns Observable with mock response
   */
  register(username: string, email: string, password: string): Observable<any> {
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        // Check if email already exists
        if (this.users.find(u => u.email === email)) {
          return throwError(() => ({ error: 'Email already exists' }));
        }
        
        // Check if username already exists
        if (this.users.find(u => u.username === username)) {
          return throwError(() => ({ error: 'Username already exists' }));
        }

        // Create new user
        const newUser = {
          id: (this.users.length + 1).toString(),
          username,
          email,
          password
        };
        
        this.users.push(newUser);

        // Return success response
        return of({
          status: 201,
          body: {
            message: 'User created successfully',
            id: newUser.id
          }
        });
      })
    );
  }

  /**
   * Mock logout endpoint - simulates Django logout
   * @param id - The user ID
   * @returns Observable with mock response
   */
  logout(id: string): Observable<any> {
    return of({
      status: 200,
      body: {
        message: 'Logged out successfully'
      }
    }).pipe(delay(300));
  }

  /**
   * Mock token refresh endpoint - simulates Django JWT token refresh
   * @param refreshToken - The refresh token
   * @returns Observable with new access token
   */
  refreshToken(refreshToken: string): Observable<any> {
    return of({
      access: this.generateMockToken('access')
    }).pipe(delay(300));
  }

  /**
   * Generate a mock JWT token
   * @param type - Token type (access or refresh)
   * @returns Mock token string
   */
  private generateMockToken(type: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `mock_${type}_token_${timestamp}_${random}`;
  }
}

// Helper function for switchMap operator
import { switchMap } from 'rxjs/operators';
