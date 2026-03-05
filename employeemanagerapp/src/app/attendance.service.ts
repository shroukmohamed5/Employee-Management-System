import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private apiUrl = 'http://localhost:8080/attendance';

  constructor(private http: HttpClient) {}

  getTodayAttendance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/today`);
  }

  checkIn(employeeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkin`, { employeeId: employeeId.toString() });
  }

  checkOut(employeeId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/checkout/${employeeId}`, {});
  }

  markAbsent(employeeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/absent`, { employeeId: employeeId.toString() });
  }
}