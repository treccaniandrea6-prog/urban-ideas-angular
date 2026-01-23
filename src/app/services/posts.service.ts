import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private API_URL = 'https://gorest.co.in/public/v2';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  // 🔹 Post di un utente
  getPostsByUser(userId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    const id = Number(userId);

    return this.http.get<any[]>(
      `${this.API_URL}/users/${id}/posts`,
      { headers }
    );
  }

  // 🔹 Commenti di un post
  getCommentsByPost(postId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    const id = Number(postId);

    return this.http.get<any[]>(
      `${this.API_URL}/posts/${id}/comments`,
      { headers }
    );
  }

  // 🔹 Crea un commento
  createComment(
    postId: number,
    payload: { name: string; email: string; body: string }
  ): Observable<any> {
    const headers = this.getAuthHeaders();
    const id = Number(postId);

    return this.http.post<any>(
      `${this.API_URL}/posts/${id}/comments`,
      payload,
      { headers }
    );
  }
  getAllPosts(page: number = 1, perPage: number = 10): Observable<any[]> {
  const headers = this.getAuthHeaders();
  const safePage = Math.max(1, Number(page) || 1);
  const safePerPage = Math.min(50, Math.max(1, Number(perPage) || 10));

  return this.http.get<any[]>(
    `${this.API_URL}/posts?page=${safePage}&per_page=${safePerPage}`,
    { headers }
  );
}
createPost(payload: { user_id: number; title: string; body: string }): Observable<any> {
  const headers = this.getAuthHeaders();

  return this.http.post<any>(
    `${this.API_URL}/posts`,
    payload,
    { headers }
  );
}
}