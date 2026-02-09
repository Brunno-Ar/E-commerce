import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminService, Order, ORDER_STATUS_OPTIONS } from '../../services/admin.service';
import { OrderDetailsDialogComponent } from './order-details-dialog.component';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    templateUrl: './admin-orders.component.html',
    styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent {
    private adminService = inject(AdminService);
    private dialog = inject(MatDialog);

    orders = signal<Order[]>([]);
    loading = signal(true);
    displayedColumns = ['id', 'date', 'customer', 'total', 'status', 'actions'];

    statusOptions = ORDER_STATUS_OPTIONS;

    constructor() {
        this.loadOrders();
    }

    loadOrders(): void {
        this.loading.set(true);
        this.adminService.getAllOrders().subscribe({
            next: (data) => {
                // Ordenar por data (mais recente primeiro)
                const sorted = data.sort((a, b) =>
                    new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
                );
                this.orders.set(sorted);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar pedidos:', err);
                this.loading.set(false);
            }
        });
    }

    getStatusLabel(status: string): string {
        const option = this.statusOptions.find(o => o.value === status);
        return option ? option.label : status;
    }

    getStatusColor(status: string): string {
        const option = this.statusOptions.find(o => o.value === status);
        return option ? option.color : '#ccc';
    }

    openDetails(orderId: number): void {
        const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
            width: '800px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            data: { orderId }
        });

        // Recarregar lista ao fechar se houver alterações
        dialogRef.afterClosed().subscribe(updated => {
            if (updated) {
                this.loadOrders();
            }
        });
    }
}
