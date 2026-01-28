import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'token';

  setToken(token: string): void {
    sessionStorage.setItem(this.KEY, token.trim());
  }

  getToken(): string {
    return sessionStorage.getItem(this.KEY) ?? '';
  }

  isLoggedIn(): boolean {
    return this.getToken().length > 0;
  }

  logout(): void {
    sessionStorage.removeItem(this.KEY);
  }
}