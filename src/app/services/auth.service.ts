import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrls.login;

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth`, credentials);
  }

  // Add other auth-related methods as needed
} 