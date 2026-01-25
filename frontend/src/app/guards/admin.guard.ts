import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    if (authService.isAdmin()) {
        return true;
    } else {
        snackBar.open('Acesso restrito a administradores.', 'Fechar', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error'] // Ensure this class exists or it will just be default
        });
        router.navigate(['/']);
        return false;
    }
};
