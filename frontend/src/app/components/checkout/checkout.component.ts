import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { EcommerceService } from '../../services/ecommerce.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        RouterModule,
        CurrencyPipe
    ],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    cartItems: CartItem[] = [];
    subtotal: number = 0;
    shipping: number = 0; // Free for now
    tax: number = 0; // Calculated if needed, set to 0 for simplicity or based on logic
    total: number = 0;
    loading = false;

    constructor(
        private cartService: CartService,
        private ecommerceService: EcommerceService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(items => {
            this.cartItems = items;
            this.calculateTotals();
        });
    }

    calculateTotals() {
        this.subtotal = this.cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        // Exemplo: Taxa de 5% (fictício)
        this.tax = 0;
        this.total = this.subtotal + this.shipping + this.tax;
    }

    incrementQuantity(item: CartItem) {
        this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    }

    decrementQuantity(item: CartItem) {
        if (item.quantity > 1) {
            this.cartService.updateQuantity(item.product.id, item.quantity - 1);
        } else {
            this.removeItem(item);
        }
    }

    removeItem(item: CartItem) {
        this.cartService.removeFromCart(item.product.id);
        this.snackBar.open(`${item.product.name} removido`, 'Undo', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
        }).onAction().subscribe(() => {
            this.cartService.addToCart(item.product); // Simple undo logic, resets qty to 1 though with current addToCart
        });
    }

    finalizeOrder() {
        if (this.cartItems.length === 0) return;

        this.loading = true;

        const checkoutItems = this.cartItems.map(item => ({
            productId: item.product.id,
            title: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            isAffiliate: item.product.isAffiliate || false
        }));

        this.ecommerceService.checkout(checkoutItems).subscribe({
            next: (response) => {
                this.cartService.clearCart();
                window.location.href = response.url;
            },
            error: (err) => {
                console.error('Erro no checkout', err);
                this.loading = false;
                this.snackBar.open('Erro ao processar. Tente novamente.', 'Fechar', {
                    duration: 3000,
                    panelClass: ['snackbar-error']
                });
            }
        });
    }

    continueShopping() {
        this.router.navigate(['/']);
    }
}
