import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressDTO } from '../models/address.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = `${environment.apiUrl}/api/addresses`;

  constructor(private http: HttpClient) {}

  getUserAddresses(): Observable<AddressDTO[]> {
    return this.http.get<AddressDTO[]>(this.apiUrl);
  }

  createAddress(address: AddressDTO): Observable<AddressDTO> {
    return this.http.post<AddressDTO>(this.apiUrl, address);
  }

  updateAddress(id: number, address: AddressDTO): Observable<AddressDTO> {
    return this.http.put<AddressDTO>(`${this.apiUrl}/${id}`, address);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDefaultAddress(type: 'BILLING' | 'SHIPPING' | 'BOTH'): Observable<AddressDTO> {
    return this.http.get<AddressDTO>(`${this.apiUrl}/default/${type}`);
  }

  getAddressesByType(type: 'BILLING' | 'SHIPPING' | 'BOTH'): Observable<AddressDTO[]> {
    return this.http.get<AddressDTO[]>(`${this.apiUrl}/type/${type}`);
  }
}