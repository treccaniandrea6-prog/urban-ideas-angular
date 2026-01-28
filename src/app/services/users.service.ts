import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export type CreateUserPayload = {
  name: string;
  email: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private API_URL = 'https://gorest.co.in/public/v2';

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  getUsers(page: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    const safePage = Math.max(1, Number(page) || 1);

    return this.http.get<any[]>(`${this.API_URL}/users?page=${safePage}`, { headers });
  }

  createUser(payload: CreateUserPayload): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.API_URL}/users`, payload, { headers });
  }

  deleteUser(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const id = Number(userId);
    return this.http.delete<any>(`${this.API_URL}/users/${id}`, { headers });
  }

  getUserById(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const id = Number(userId);
    return this.http.get<any>(`${this.API_URL}/users/${id}`, { headers });
  }

  getUserPosts(userId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    const id = Number(userId);
    return this.http.get<any[]>(`${this.API_URL}/users/${id}/posts`, { headers });
  }
}