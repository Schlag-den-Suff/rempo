import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Define interfaces for API responses
interface HealthCheckResponse {
  status: string;
  uptime: number;
}

interface ApiInfoResponse {
  version: string;
  environment: string;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient); // use inject() instead of constructor

  // Remove constructor when using inject()
  // constructor(private http: HttpClient) {}

  /**
   * Health check endpoint
   */
  healthCheck(): Observable<HealthCheckResponse> {
    return this.http.get<HealthCheckResponse>(`${this.apiUrl}/health/`);
  }

  /**
   * API information endpoint
   */
  getApiInfo(): Observable<ApiInfoResponse> {
    return this.http.get<ApiInfoResponse>(`${this.apiUrl}/info/`);
  }
}
