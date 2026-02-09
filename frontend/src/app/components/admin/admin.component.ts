import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { EcommerceService } from '../../services/ecommerce.service';
import { Product } from '../../models/product.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        RouterModule,
        MatDialogModule,
        MatSnackBarModule
    ],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    displayedColumns: string[] = ['image', 'name', 'price', 'type', 'actions'];
    dataSource = new MatTableDataSource<Product>([]);

    private ecommerceService = inject(EcommerceService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts() {
        this.ecommerceService.getProducts(undefined, undefined, 0, 1000).subscribe({
            next: (data) => {
                this.dataSource.data = data.content;
            },
            error: (err) => console.error(err)
        });
    }

    deleteProduct(id: number) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.ecommerceService.deleteProduct(id).subscribe({
                next: () => {
                    this.showSnackBar('Produto excluído com sucesso');
                    this.loadProducts(); // Refresh table
                },
                error: () => this.showSnackBar('Erro ao excluir produto')
            });
        }
    }

    editProduct(id: number) {
        this.router.navigate(['/admin/edit', id]);
    }

    navigateToNew() {
        this.router.navigate(['/admin/new']);
    }

    private showSnackBar(msg: string) {
        this.snackBar.open(msg, 'Ok', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }
}
