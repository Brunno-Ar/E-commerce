import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { AdminService, Order, ORDER_STATUS_OPTIONS, OrderStatus } from '../../services/admin.service';

@Component({
    selector: 'app-order-details-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDividerModule,
        MatCardModule
    ],
    templateUrl: './order-details-dialog.component.html',
    styleUrls: ['./order-details-dialog.component.scss']
})
export class OrderDetailsDialogComponent {
    private adminService = inject(AdminService);
    private snackBar = inject(MatSnackBar);

    order = signal<Order | null>(null);
    loading = signal(true);
    updating = signal(false);

    // Status management
    currentStatus: OrderStatus | null = null;
    statusOptions = ORDER_STATUS_OPTIONS;

    constructor(
        public dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { orderId: number }
    ) {
        this.loadOrderDetails();
    }

    loadOrderDetails(): void {
        this.loading.set(true);
        this.adminService.getOrderById(this.data.orderId).subscribe({
            next: (data) => {
                this.order.set(data);
                this.currentStatus = data.status as OrderStatus;
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar detalhes:', err);
                this.loading.set(false);
                this.dialogRef.close();
                this.showError('Erro ao carregar pedido');
            }
        });
    }

    updateStatus(): void {
        if (!this.order() || !this.currentStatus) return;

        this.updating.set(true);
        this.adminService.updateOrderStatus(this.order()!.id, this.currentStatus!).subscribe({
            next: () => {
                this.updating.set(false);
                this.showSuccess('Status atualizado com sucesso!');
                // Wait a bit and close
                setTimeout(() => this.dialogRef.close(true), 1000);
            },
            error: (err) => {
                console.error('Erro ao atualizar status:', err);
                this.updating.set(false);
                this.showError(err.error?.error || 'Erro ao atualizar status');
                // Revert selection
                this.currentStatus = this.order()!.status as OrderStatus;
            }
        });
    }

    getStatusColor(status: string): string {
        const option = this.statusOptions.find(o => o.value === status);
        return option ? option.color : '#ccc';
    }

    getStatusLabel(status: string): string {
        const option = this.statusOptions.find(o => o.value === status);
        return option ? option.label : status;
    }

    private showSuccess(message: string): void {
        this.snackBar.open(message, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
        });
    }

    private showError(message: string): void {
        this.snackBar.open(message, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error']
        });
    }
}
