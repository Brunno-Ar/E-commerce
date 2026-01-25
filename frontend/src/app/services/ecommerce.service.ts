import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

    getProducts(categoryId?: number, search?: string): Observable<Product[]> {
        let params = new HttpParams();
        if (categoryId) {
            params = params.set('categoryId', categoryId);
        }
        if (search) {
            params = params.set('query', search);
        }
        return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
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

    checkout(items: any[]): Observable<{ url: string }> {
        return this.http.post<{ url: string }>(`${this.apiUrl}/checkout/process`, items);
    }

    // Admin Methods
    createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrl}/products`, product);
    }

    updateProduct(id: number, product: Product): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
    }
}
