import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EcommerceService } from '../../services/ecommerce.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-admin-products',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSnackBarModule,
        CurrencyPipe
    ],
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
    products = signal<Product[]>([]);
    loading = signal(true);
    deletingId = signal<number | null>(null);

    constructor(
        private ecommerceService: EcommerceService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading.set(true);
        this.ecommerceService.getProducts().subscribe({
            next: (products) => {
                this.products.set(products);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar produtos:', err);
                this.loading.set(false);
                this.showNotification('Erro ao carregar produtos', 'error');
            }
        });
    }

    navigateToNew(): void {
        this.router.navigate(['/admin/products/new']);
    }

    editProduct(product: Product): void {
        this.router.navigate(['/admin/products/edit', product.id]);
    }

    async deleteProduct(product: Product): Promise<void> {
        if (!confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
            return;
        }

        this.deletingId.set(product.id);

        this.ecommerceService.deleteProduct(product.id).subscribe({
            next: () => {
                this.products.update(products =>
                    products.filter(p => p.id !== product.id)
                );
                this.showNotification('Produto excluído com sucesso!', 'success');
                this.deletingId.set(null);
            },
            error: (err) => {
                console.error('Erro ao excluir produto:', err);
                this.showNotification('Erro ao excluir produto', 'error');
                this.deletingId.set(null);
            }
        });
    }

    getProductType(product: Product): string {
        return product.isAffiliate ? 'Afiliado' : 'Nativo';
    }

    getProductTypeClass(product: Product): string {
        return product.isAffiliate ? 'type-affiliate' : 'type-native';
    }

    private showNotification(message: string, type: 'success' | 'error'): void {
        this.snackBar.open(message, 'Fechar', {
            duration: 3000,
            panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar',
            horizontalPosition: 'end',
            verticalPosition: 'top'
        });
    }
}
