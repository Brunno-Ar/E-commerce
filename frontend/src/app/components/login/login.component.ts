
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        RouterLink
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm: FormGroup;
    hidePassword = signal(true);
    errorMessage = signal('');

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    togglePassword(event: MouseEvent) {
        event.preventDefault();
        this.hidePassword.update(value => !value);
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.errorMessage.set('');
            const { email, password } = this.loginForm.value;
            this.authService.login(email, password).subscribe({
                next: (response) => {
                    // Redireciona admins para o dashboard, usuários para a loja
                    if (response.role === 'ADMIN') {
                        this.router.navigate(['/admin']);
                    } else {
                        this.router.navigate(['/']);
                    }
                },
                error: (err) => {
                    console.error('Login error', err);
                    this.errorMessage.set('Falha no login. Verifique suas credenciais.');
                }
            });
        }
    }
}
