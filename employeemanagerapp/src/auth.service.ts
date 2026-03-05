import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const email = this.getAdminEmail();
    return this.http.put(`${this.apiUrl}/change-password`, { email, oldPassword, newPassword });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminEmail');
  }

  saveSession(email: string): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('adminEmail', email);
  }

  getAdminEmail(): string {
    return localStorage.getItem('adminEmail') || '';
  }
}