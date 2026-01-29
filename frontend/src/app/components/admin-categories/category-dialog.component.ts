import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../models/category.model';

export interface CategoryDialogData {
    mode: 'create' | 'edit';
    category: Category | null;
}

@Component({
    selector: 'app-category-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    template: `
        <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nova Categoria' : 'Editar Categoria' }}</h2>
        <mat-dialog-content>
            <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nome da Categoria</mat-label>
                <input matInput [(ngModel)]="categoryName" placeholder="Ex: Eletrônicos" required (keyup.enter)="onSave()">
            </mat-form-field>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button (click)="onCancel()">Cancelar</button>
            <button mat-flat-button color="primary" [disabled]="!categoryName.trim()" (click)="onSave()">
                {{ data.mode === 'create' ? 'Criar' : 'Salvar' }}
            </button>
        </mat-dialog-actions>
    `,
    styles: [`
        .full-width {
            width: 100%;
        }
        mat-dialog-content {
            padding-top: 1rem !important;
            min-width: 300px;
        }
    `]
})
export class CategoryDialogComponent {
    categoryName: string = '';

    constructor(
        public dialogRef: MatDialogRef<CategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData
    ) {
        if (data.mode === 'edit' && data.category) {
            this.categoryName = data.category.name;
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.categoryName.trim()) {
            this.dialogRef.close(this.categoryName.trim());
        }
    }
}
