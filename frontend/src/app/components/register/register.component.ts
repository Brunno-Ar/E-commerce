
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
    selector: 'app-register',
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
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm: FormGroup;
    hidePassword = signal(true);
    errorMessage = signal('');

    constructor() {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    togglePassword(event: MouseEvent) {
        event.preventDefault();
        this.hidePassword.update(value => !value);
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.errorMessage.set('');
            const { name, email, password } = this.registerForm.value;
            this.authService.register(name, email, password).subscribe({
                next: () => {
                    // Success, redirect to login
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    console.error('Registration error', err);
                    this.errorMessage.set('Falha no cadastro. Tente novamente.');
                }
            });
        }
    }
}
