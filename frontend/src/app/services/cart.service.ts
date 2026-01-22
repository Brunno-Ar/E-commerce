import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartKey = 'ecommerce_cart';
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    cartItems$ = this.cartItemsSubject.asObservable();

    constructor(private snackBar: MatSnackBar) {
        this.loadCart();
    }

    private loadCart() {
        const savedCart = localStorage.getItem(this.cartKey);
        if (savedCart) {
            try {
                this.cartItemsSubject.next(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error parsing cart from local storage', e);
                this.cartItemsSubject.next([]);
            }
        }
    }

    private saveCart(items: CartItem[]) {
        localStorage.setItem(this.cartKey, JSON.stringify(items));
        this.cartItemsSubject.next(items);
    }

    addToCart(product: Product) {
        const currentItems = this.cartItemsSubject.value;
        const existingItem = currentItems.find(item => item.product.id === product.id);

        let updatedItems;

        if (existingItem) {
            existingItem.quantity += 1;
            updatedItems = [...currentItems];
        } else {
            updatedItems = [...currentItems, { product, quantity: 1 }];
        }

        this.saveCart(updatedItems);
        this.showSnackBar(`${product.name} adicionado ao carrinho`);
    }

    removeFromCart(productId: number) {
        const currentItems = this.cartItemsSubject.value;
        const updatedItems = currentItems.filter(item => item.product.id !== productId);
        this.saveCart(updatedItems);
    }

    updateQuantity(productId: number, quantity: number) {
        const currentItems = this.cartItemsSubject.value;
        const itemIndex = currentItems.findIndex(item => item.product.id === productId);

        if (itemIndex > -1) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
                return;
            }
            currentItems[itemIndex].quantity = quantity;
            this.saveCart([...currentItems]);
        }
    }

    clearCart() {
        this.saveCart([]);
    }

    getTotal(): number {
        return this.cartItemsSubject.value.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    }

    getCount(): number {
        return this.cartItemsSubject.value.reduce((acc, item) => acc + item.quantity, 0);
    }

    private showSnackBar(message: string) {
        this.snackBar.open(message, 'Ver Carrinho', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }
}
