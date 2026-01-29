import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcommerceService } from '../../services/ecommerce.service';
import { Order } from '../../models/order.model';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatChipsModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './client-orders.component.html',
  styleUrl: './client-orders.component.css' // Note: generated as css
})
export class ClientOrdersComponent implements OnInit {
  ecommerceService = inject(EcommerceService);
  displayedColumns: string[] = ['id', 'date', 'status', 'total', 'items'];
  orders: Order[] = [];

  ngOnInit(): void {
    this.ecommerceService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Error fetching orders', err);
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PAID': return 'accent'; // Or custom class for Green
      case 'PENDING': return 'warn'; // Or custom class for Yellow
      default: return 'primary';
    }
  }
}
