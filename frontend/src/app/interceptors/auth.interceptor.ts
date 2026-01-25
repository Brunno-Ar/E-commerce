
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    let activeRequest = req;

    if (token) {
        activeRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(activeRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            // Apenas 401 (Unauthorized) significa que o token expirou ou é inválido
            // 403 (Forbidden) significa que o usuário está autenticado mas não tem permissão
            // Não devemos deslogar em 403!
            if (error.status === 401) {
                // Clear storage
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userRole');

                // Redirect to login
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
