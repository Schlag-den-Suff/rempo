import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get friends list for a specific user
   * @param userId - The ID of the user
   * @returns Observable of User array
   */
  getFriends(userId: string): Observable<User[]> {
    // TODO: Replace with actual API call when backend is ready
    // return this.http.get<User[]>(`${this.apiUrl}/${userId}/friends`);
    
    // Mock data for now
    return of([]);
  }

  /**
   * Search for a user by email or username
   * @param searchTerm - Email or username to search for
   * @returns Observable of User or null
   */
  searchUser(searchTerm: string): Observable<User | null> {
    // TODO: Replace with actual API call when backend is ready
    // return this.http.get<User>(`${this.apiUrl}/search?term=${encodeURIComponent(searchTerm)}`);
    
    // Mock implementation for now
    return of(null);
  }

  /**
   * Check if an email exists in the system
   * @param email - Email to check
   * @returns Observable of boolean
   */
  checkEmailExists(email: string): Observable<boolean> {
    // TODO: Replace with actual API call when backend is ready
    // return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${encodeURIComponent(email)}`);
    
    // Mock implementation for now
    return of(false);
  }

  /**
   * Send an invitation to a user by email
   * @param email - Email to send invitation to
   * @param gameId - ID of the game to invite to
   * @returns Observable of any
   */
  sendInvitation(email: string, gameId?: string): Observable<any> {
    // TODO: Replace with actual API call when backend is ready
    // return this.http.post(`${this.apiUrl}/invite`, { email, gameId });
    
    // Mock implementation for now
    return of({ success: true, message: 'Invitation sent' });
  }
}
