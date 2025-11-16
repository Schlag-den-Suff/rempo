import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Health check endpoint
   */
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health/`);
  }

  /**
   * API information endpoint
   */
  getApiInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/info/`);
  }
}

