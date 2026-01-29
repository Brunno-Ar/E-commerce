import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { EcommerceService } from '../../services/ecommerce.service';
import { CartItem } from '../../models/cart-item.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        RouterModule,
        CurrencyPipe,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    cartItems: CartItem[] = [];
    subtotal: number = 0;
    shipping: number = 0;
    tax: number = 0;
    total: number = 0;
    loading = false;
    addressForm: FormGroup;

    @ViewChild('numberInput') numberInputRef!: ElementRef<HTMLInputElement>;

    constructor(
        private cartService: CartService,
        private ecommerceService: EcommerceService,
        private router: Router,
        private snackBar: MatSnackBar,
        private fb: FormBuilder
    ) {
        this.addressForm = this.fb.group({
            zipCode: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
            street: ['', Validators.required],
            number: ['', Validators.required],
            complement: [''],
            neighborhood: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.cartService.cartItems$.subscribe(items => {
            this.cartItems = items;
            this.calculateTotals();
        });
    }

    calculateTotals() {
        this.subtotal = this.cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
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
            this.cartService.addToCart(item.product);
        });
    }

    onZipCodeBlur() {
        const cep = this.addressForm.get('zipCode')?.value;
        if (cep && cep.length === 8) {
            this.loading = true; // Show loading indicator somewhere ideally
            this.ecommerceService.getAddressByCep(cep).subscribe({
                next: (data) => {
                    this.loading = false;
                    if (!data.erro) {
                        this.addressForm.patchValue({
                            street: data.logradouro,
                            neighborhood: data.bairro,
                            city: data.localidade,
                            state: data.uf
                        });
                        // Foca no campo número para melhor UX
                        setTimeout(() => {
                            this.numberInputRef?.nativeElement?.focus();
                        }, 100);
                    } else {
                        this.snackBar.open('CEP não encontrado.', 'Fechar', { duration: 3000 });
                    }
                },
                error: () => {
                    this.loading = false;
                    this.snackBar.open('Erro ao buscar CEP.', 'Fechar', { duration: 3000 });
                }
            });
        }
    }

    finalizeOrder() {
        if (this.cartItems.length === 0) return;

        if (this.addressForm.invalid) {
            this.addressForm.markAllAsTouched();
            this.snackBar.open('Por favor, preencha o endereço de entrega.', 'Fechar', { duration: 3000 });
            return;
        }

        this.loading = true;

        const orderData = {
            items: this.cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            })),
            shippingAddress: this.addressForm.value
        };

        this.ecommerceService.checkout(orderData).subscribe({
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
