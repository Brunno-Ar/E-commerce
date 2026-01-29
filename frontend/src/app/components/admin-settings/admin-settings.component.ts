import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EcommerceService } from '../../services/ecommerce.service';
import { SiteConfig } from '../../models/site-config.model';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css' // Note: generated as css
})
export class AdminSettingsComponent implements OnInit {
  fb = inject(FormBuilder);
  ecommerceService = inject(EcommerceService);
  snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    heroTitle: ['', Validators.required],
    heroSubtitle: ['', Validators.required],
    heroButtonText: ['', Validators.required]
  });

  ngOnInit(): void {
    this.ecommerceService.getConfig().subscribe(config => {
      if (config) {
        this.form.patchValue(config);
      }
    });
  }

  saveConfig(): void {
    if (this.form.valid) {
      const config: SiteConfig = {
        id: 'DEFAULT', // Always default
        ...this.form.value
      };

      this.ecommerceService.updateConfig(config).subscribe({
        next: () => {
          this.snackBar.open('Loja Atualizada!', 'Fechar', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error updating config', err);
          this.snackBar.open('Erro ao atualizar.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}
