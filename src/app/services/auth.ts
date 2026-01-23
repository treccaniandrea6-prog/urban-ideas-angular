import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  login(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token.trim());
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string {
    return sessionStorage.getItem(this.TOKEN_KEY) ?? '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}