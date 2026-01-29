import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    affiliateProducts: number;
    nativeProducts: number;
}

export interface OrderAddress {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}

export interface OrderUser {
    id: number;
    name: string;
    email: string;
}

export interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
        imageUrl: string;
    };
    quantity: number;
    priceAtPurchase: number;
}

export interface Order {
    id: number;
    dateTime: string;
    status: OrderStatus;
    totalValue: number;
    items: OrderItem[];
    user?: OrderUser;
    shippingAddress?: OrderAddress;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'PENDING', label: 'Pendente', color: '#f59e0b' },
    { value: 'PAID', label: 'Pago', color: '#3b82f6' },
    { value: 'PROCESSING', label: 'Em Processamento', color: '#8b5cf6' },
    { value: 'SHIPPED', label: 'Enviado', color: '#06b6d4' },
    { value: 'DELIVERED', label: 'Entregue', color: '#10b981' },
    { value: 'CANCELED', label: 'Cancelado', color: '#ef4444' }
];

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    // ========== DASHBOARD ==========
    getDashboardStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
    }

    // ========== ORDERS ==========
    getRecentOrders(limit: number = 5): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders?limit=${limit}`);
    }

    getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`);
    }

    getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
    }

    updateOrderStatus(orderId: number, status: OrderStatus): Observable<any> {
        return this.http.put(`${this.apiUrl}/orders/${orderId}/status`, { status });
    }

    // ========== CATEGORIES ==========
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/categories`);
    }

    createCategory(name: string): Observable<Category> {
        return this.http.post<Category>(`${this.apiUrl}/categories`, { name });
    }

    updateCategory(id: number, name: string): Observable<Category> {
        return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, { name });
    }

    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
    }
}
