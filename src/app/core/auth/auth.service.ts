import { Injectable } from '@angular/core';

const TOKEN_KEY = 'gorest_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
