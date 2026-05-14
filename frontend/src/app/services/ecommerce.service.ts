import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Page } from '../models/page.model';

import { environment } from '../../environments/environment';

import { Order } from '../models/order.model';
import { UserRegistrationDTO } from '../models/user-registration.model';
import { AddressDTO } from '../models/address.model';

@Injectable({
    providedIn: 'root'
})
export class EcommerceService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getProducts(categoryId?: number, search?: string, page: number = 0, size: number = 10): Observable<Page<Product>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (categoryId) {
            params = params.set('categoryId', categoryId);
        }
        if (search) {
            params = params.set('query', search);
        }
        return this.http.get<Page<Product>>(`${this.apiUrl}/products`, { params });
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/categories`);
    }

    getProductsByCategory(categoryId: number, page: number = 0, size: number = 10): Observable<Page<Product>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<Page<Product>>(`${this.apiUrl}/products/category/${categoryId}`, { params });
    }

    getMyOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders/my-orders`);
    }

    createOrder(orderData: { items: { productId: number; quantity: number }[] }): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/orders`, orderData);
    }

    checkout(orderData: any): Observable<{ url: string }> {
        return this.http.post<{ url: string }>(`${this.apiUrl}/checkout/process`, orderData);
    }

    getAddressByCep(cep: string): Observable<any> {
        return this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`);
    }

    // Advanced User Management
    registerUser(userData: UserRegistrationDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, userData);
    }

    updateUserProfile(userData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/auth/profile`, userData);
    }

    // Address Management
    getUserAddresses(): Observable<AddressDTO[]> {
        return this.http.get<AddressDTO[]>(`${this.apiUrl}/addresses`);
    }

    createAddress(address: AddressDTO): Observable<AddressDTO> {
        return this.http.post<AddressDTO>(`${this.apiUrl}/addresses`, address);
    }

    updateAddress(id: number, address: AddressDTO): Observable<AddressDTO> {
        return this.http.put<AddressDTO>(`${this.apiUrl}/addresses/${id}`, address);
    }

    deleteAddress(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/addresses/${id}`);
    }
}
