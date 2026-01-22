import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Product } from '../../models/product.model';
import { EcommerceService } from '../../services/ecommerce.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatGridListModule],
  template: `
    <div class="container">
      <h2>Nossos Produtos</h2>
      <div class="product-grid">
        <mat-card *ngFor="let product of products$ | async" class="product-card">
          <img mat-card-image [src]="product.imageUrl" [alt]="product.name">
          <mat-card-header>
            <mat-card-title>{{ product.name }}</mat-card-title>
            <mat-card-subtitle>{{ product.price | currency:'BRL' }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ product.description }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">ADICIONAR AO CARRINHO</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 8px; /* Slightly rounded for modern feel */
      box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Subtle shadow */
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }
    img[mat-card-image] {
      height: 200px;
      object-fit: cover;
    }
    mat-card-content {
      margin-top: 10px;
    }
  `]
})
export class ProductListComponent {
  private ecommerceService = inject(EcommerceService);
  products$ = this.ecommerceService.getProducts();
}
