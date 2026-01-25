import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService, DashboardStats, Order } from '../../services/admin.service';

interface StatCard {
    icon: string;
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, CurrencyPipe, DatePipe],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
    loading = signal(true);
    stats = signal<DashboardStats | null>(null);
    recentOrders = signal<Order[]>([]);
    statCards = signal<StatCard[]>([]);

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.loading.set(true);

        this.adminService.getDashboardStats().subscribe({
            next: (data) => {
                this.stats.set(data);
                this.updateStatCards(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar estatísticas:', err);
                this.loading.set(false);
            }
        });

        // Load recent orders
        this.adminService.getRecentOrders(5).subscribe({
            next: (orders) => {
                this.recentOrders.set(orders);
            },
            error: (err) => {
                console.error('Erro ao carregar pedidos recentes:', err);
                // Set empty array on error so UI doesn't break
                this.recentOrders.set([]);
            }
        });
    }

    private updateStatCards(data: DashboardStats): void {
        this.statCards.set([
            {
                icon: 'attach_money',
                label: 'Faturamento Total',
                value: this.formatCurrency(data.totalRevenue),
                trend: '+12% este mês',
                trendUp: true,
                color: 'blue'
            },
            {
                icon: 'shopping_cart',
                label: 'Total de Pedidos',
                value: data.totalOrders,
                trend: 'Todos os pedidos',
                trendUp: true,
                color: 'green'
            },
            {
                icon: 'inventory_2',
                label: 'Produtos Cadastrados',
                value: data.totalProducts,
                trend: `${data.nativeProducts} nativos · ${data.affiliateProducts} afiliados`,
                color: 'purple'
            },
            {
                icon: 'link',
                label: 'Produtos Afiliados',
                value: data.affiliateProducts,
                trend: `${Math.round((data.affiliateProducts / data.totalProducts) * 100)}% do catálogo`,
                color: 'orange'
            }
        ]);
    }

    private formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    getStatusClass(status: string): string {
        return status === 'PAID' ? 'status-paid' : 'status-pending';
    }

    getStatusLabel(status: string): string {
        return status === 'PAID' ? 'Pago' : 'Pendente';
    }
}
