import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { EcommerceService } from '../../services/ecommerce.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatSnackBarModule],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    cartItems: CartItem[] = [];
    displayedColumns: string[] = ['name', 'quantity', 'price', 'subtotal'];
    total: number = 0;

    constructor(
        private cartService: CartService,
        private ecommerceService: EcommerceService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(items => {
            this.cartItems = items;
            this.total = this.cartService.getTotal();
        });
    }

    finalizeOrder() {
        if (this.cartItems.length === 0) {
            this.snackBar.open('Seu carrinho está vazio!', 'Fechar', { duration: 3000 });
            return;
        }

        const orderPayload = {
            items: this.cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }))
        };

        this.ecommerceService.createOrder(orderPayload).subscribe({
            next: (orderId) => {
                this.cartService.clearCart();
                this.snackBar.open(`Pedido #${orderId} realizado com sucesso!`, 'Fechar', {
                    duration: 5000,
                    panelClass: ['success-snackbar'] // Optional: customizable via CSS
                });
                this.router.navigate(['/']);
            },
            error: (err) => {
                console.error('Erro ao finalizar pedido', err);
                this.snackBar.open('Erro ao realizar pedido. Tente novamente.', 'Fechar', {
                    duration: 3000,
                    panelClass: ['error-snackbar']
                });
            }
        });
    }
}
