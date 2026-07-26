import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthResponse, AuthResponseData } from '../models/AuthResponse';

export interface LoginRequest {
    username?: string;
    password?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly loginUrl = 'http://localhost:8080/api/auth/login';

    login(credentials: LoginRequest): Observable<AuthResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post<AuthResponse>(this.loginUrl, credentials, { headers })
            .pipe(
                map(response => new AuthResponse(response))
            );
    }

    setSession(authData: AuthResponseData): void {
        localStorage.setItem('jwt_token', authData.token);
        localStorage.setItem('user_role', authData.role);
    }

    isLoggedIn(): boolean {
        return true;
        return !!localStorage.getItem('jwt_token');
    }

    getRole(): string | null {
        return localStorage.getItem('user_role');
    }

    logout(): void {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_role');
    }

}