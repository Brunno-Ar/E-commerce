import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-checkout-callback',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, RouterModule],
    template: `
    <div class="callback-container fade-in">
        @if (loading) {
            <div class="status-content">
                <mat-spinner diameter="60"></mat-spinner>
                <h2>Processando confirmação...</h2>
            </div>
        } @else if (success) {
            <div class="status-content success">
                <div class="icon-wrapper">
                    <mat-icon>check_circle</mat-icon>
                </div>
                <h1>Pagamento Aprovado!</h1>
                <p>Seu pedido foi confirmado com sucesso. Obrigado por comprar na Technoo.</p>
                <div class="actions">
                    <button mat-raised-button color="primary" routerLink="/admin/orders">Ver Meus Pedidos</button>
                    <button mat-stroked-button routerLink="/">Continuar Comprando</button>
                </div>
            </div>
        } @else {
            <div class="status-content error">
                <div class="icon-wrapper error">
                    <mat-icon>error</mat-icon>
                </div>
                <h1>Problema no Pagamento</h1>
                <p>Não conseguimos confirmar seu pagamento. Por favor, tente novamente.</p>
                <div class="actions">
                    <button mat-raised-button color="warn" routerLink="/checkout">Tentar Novamente</button>
                </div>
            </div>
        }
    </div>
  `,
    styles: [`
    .callback-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
        padding: 20px;
        text-align: center;
        color: #f8fafc;
    }

    .status-content {
        background: #1e293b;
        padding: 40px;
        border-radius: 16px;
        border: 1px solid #334155;
        max-width: 500px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .icon-wrapper {
        margin-bottom: 8px;
        mat-icon {
            font-size: 64px;
            width: 64px;
            height: 64px;
            color: #22c55e;
        }

        &.error mat-icon {
            color: #ef4444;
        }
    }

    h1 {
        font-size: 24px;
        font-weight: 700;
        margin: 0;
    }

    p {
        color: #94a3b8;
        margin-bottom: 24px;
    }

    .actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
    }
  `]
})
export class CheckoutCallbackComponent implements OnInit {
    loading = true;
    success = false;

    constructor(
        private route: ActivatedRoute,
        private cartService: CartService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const status = params['collection_status'] || params['status'];

            // Simulating backend verification delay
            setTimeout(() => {
                this.loading = false;

                if (status === 'approved') {
                    this.success = true;
                    this.cartService.clearCart();
                } else {
                    this.success = false;
                }
            }, 1500);
        });
    }
}
