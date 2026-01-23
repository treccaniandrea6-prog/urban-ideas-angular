import { Injectable } from '@angular/core';
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
  private API_USERS = 'https://gorest.co.in/public/v2/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  getUsers(page: number = 1): Observable<any[]> {
    const headers = this.getHeaders();
    const safePage = Math.max(1, Number(page) || 1);

    return this.http.get<any[]>(
      `${this.API_USERS}?page=${safePage}&per_page=10`,
      { headers }
    );
  }

  getUserById(userId: number): Observable<any> {
    const headers = this.getHeaders();
    const id = Math.max(1, Number(userId) || 1);
    return this.http.get<any>(`${this.API_USERS}/${id}`, { headers });
  }

  getUserPosts(userId: number): Observable<any[]> {
    const headers = this.getHeaders();
    const id = Math.max(1, Number(userId) || 1);
    return this.http.get<any[]>(`${this.API_USERS}/${id}/posts`, { headers });
  }

  createUser(payload: CreateUserPayload): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.API_USERS, payload, { headers });
  }

  deleteUser(userId: number): Observable<void> {
    const headers = this.getHeaders();
    const id = Math.max(1, Number(userId) || 1);
    return this.http.delete<void>(`${this.API_USERS}/${id}`, { headers });
  }
}