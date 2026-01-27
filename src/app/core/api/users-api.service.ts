import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly baseUrl = 'https://gorest.co.in/public/v2/users';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // ✅ GET UTENTI — SENZA TOKEN
  getUsers(page: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?page=${page}`);
  }

  // 🔒 CREATE — CON TOKEN (da sessione)
  createUser(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload, {
      headers: this.authHeaders(),
    });
  }

  // 🔒 DELETE — CON TOKEN (da sessione)
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      headers: this.authHeaders(),
    });
  }

  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
      'Content-Type': 'application/json',
    });
  }
}
