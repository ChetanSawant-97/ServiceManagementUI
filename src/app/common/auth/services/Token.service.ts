import { Injectable } from '@angular/core';
import { AuthData } from './Authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';

  saveSession(authData: AuthData): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(authData));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserData(): AuthData | null {
    const data = localStorage.getItem(this.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}