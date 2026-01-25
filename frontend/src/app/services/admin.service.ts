import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    affiliateProducts: number;
    nativeProducts: number;
}

export interface Order {
    id: number;
    dateTime: string;
    status: string;
    totalValue: number;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    productName: string;
    quantity: number;
    price: number;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getDashboardStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
    }

    getRecentOrders(limit: number = 5): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders?limit=${limit}`);
    }

    getAllOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`);
    }
}
