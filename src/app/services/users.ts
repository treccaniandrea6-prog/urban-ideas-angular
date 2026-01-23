import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private API_URL = 'https://gorest.co.in/public/v2/users';

  constructor(private http: HttpClient) {}

  getUsers(page: number): Observable<any[]> {
    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });

    return this.http.get<any[]>(
      `${this.API_URL}?page=${page}`,
      { headers }
    );
  }
}