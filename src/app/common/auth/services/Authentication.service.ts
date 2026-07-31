import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../../base-api-service';
import { TokenService } from './Token.service';
import { ApiEndpoints } from '../../ApiConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private api: BaseApiService,
    private tokenService: TokenService
  ) {}

  login(credentials: LoginRequest,showToast : boolean) {
    return this.api.request<AuthResponse, LoginRequest>(
      ApiEndpoints['AUTH_LOGIN'], 
      credentials, 
      { 
        showLoader: true, 
        successMessage: 'Login successful!' 
      }
    ).pipe(
      tap((response: AuthResponse) => {
        if (response.success && response.data) {
          this.tokenService.saveSession(response.data);
        }
      })
    );
  }

  logout() {
    this.tokenService.clearSession();
    this.router.navigate(['/login']);
  }
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthData {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  role: string;
  dealerId: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}