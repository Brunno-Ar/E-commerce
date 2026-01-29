import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { AdminService } from '../../services/admin.service';
import { Category } from '../../models/category.model';
import { CategoryDialogComponent } from './category-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
    selector: 'app-admin-categories',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        AdminLayoutComponent
    ],
    templateUrl: './admin-categories.component.html',
    styleUrls: ['./admin-categories.component.scss']
})
export class AdminCategoriesComponent {
    private adminService = inject(AdminService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

    categories = signal<Category[]>([]);
    loading = signal(true);
    displayedColumns = ['id', 'name', 'actions'];

    constructor() {
        this.loadCategories();
    }

    loadCategories(): void {
        this.loading.set(true);
        this.adminService.getCategories().subscribe({
            next: (data) => {
                this.categories.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar categorias:', err);
                this.loading.set(false);
                this.showError('Erro ao carregar categorias');
            }
        });
    }

    openNewCategoryDialog(): void {
        const dialogRef = this.dialog.open(CategoryDialogComponent, {
            width: '400px',
            data: { mode: 'create', category: null }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.createCategory(result);
            }
        });
    }

    openEditDialog(category: Category): void {
        const dialogRef = this.dialog.open(CategoryDialogComponent, {
            width: '400px',
            data: { mode: 'edit', category }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.updateCategory(category.id, result);
            }
        });
    }

    openDeleteDialog(category: Category): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Excluir Categoria',
                message: `Tem certeza que deseja excluir a categoria "${category.name}"?`,
                confirmText: 'Excluir',
                cancelText: 'Cancelar'
            }
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.deleteCategory(category.id);
            }
        });
    }

    private createCategory(name: string): void {
        this.adminService.createCategory(name).subscribe({
            next: () => {
                this.showSuccess('Categoria criada com sucesso!');
                this.loadCategories();
            },
            error: (err) => {
                console.error('Erro ao criar categoria:', err);
                this.showError('Erro ao criar categoria');
            }
        });
    }

    private updateCategory(id: number, name: string): void {
        this.adminService.updateCategory(id, name).subscribe({
            next: () => {
                this.showSuccess('Categoria atualizada com sucesso!');
                this.loadCategories();
            },
            error: (err) => {
                console.error('Erro ao atualizar categoria:', err);
                this.showError('Erro ao atualizar categoria');
            }
        });
    }

    private deleteCategory(id: number): void {
        this.adminService.deleteCategory(id).subscribe({
            next: () => {
                this.showSuccess('Categoria excluída com sucesso!');
                this.loadCategories();
            },
            error: (err) => {
                console.error('Erro ao excluir categoria:', err);
                const message = err.error?.reason || 'Erro ao excluir categoria';
                this.showError(message);
            }
        });
    }

    private showSuccess(message: string): void {
        this.snackBar.open(message, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }

    private showError(message: string): void {
        this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
        });
    }
}
