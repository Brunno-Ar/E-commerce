import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EcommerceService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/products`);
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/categories`);
    }

    getProductsByCategory(categoryId: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/products/category/${categoryId}`);
    }

    createOrder(orderData: { items: { productId: number; quantity: number }[] }): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/orders`, orderData);
    }
}
