import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class EcommerceService {
    private apiUrl = 'http://localhost:8080/api';
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
}
