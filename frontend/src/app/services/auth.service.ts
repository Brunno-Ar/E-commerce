import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginResponse {
    token: string;
    name: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl + '/auth';
    private http = inject(HttpClient);
    private router = inject(Router);

    // Reactive state
    currentUser = signal<{ name: string; email: string; role: string } | null>(this.getUserFromStorage());

    constructor() { }

    private getUserFromStorage(): { name: string; email: string; role: string } | null {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        const role = localStorage.getItem('userRole');
        if (token && name && email) {
            return { name, email, role: role || 'USER' };
        }
        return null;
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
            .pipe(
                tap(response => {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('userName', response.name);
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userRole', response.role);
                    this.currentUser.set({ name: response.name, email, role: response.role });
                })
            );
    }

    register(name: string, email: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, { name, email, password });
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    isAdmin(): boolean {
        const user = this.currentUser();
        return user?.role === 'ADMIN';
    }

    getUserEmail(): string | null {
        return this.currentUser()?.email || null;
    }
}
