import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { PlatformComparisonDTO } from '../../models/platform-comparison.model';
import { AffiliateService } from '../../services/affiliate.service';

@Component({
  selector: 'app-affiliate-comparison',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  template: `
    <div class="affiliate-comparison-container">
      <!-- Product Info -->
      <div class="product-info" *ngIf="productName">
        <h2>{{ productName }}</h2>
        <p>Compare preços nas melhores lojas:</p>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
        <p>Buscando melhores preços...</p>
      </div>

      <!-- Platforms Grid -->
      <div class="platforms-grid" *ngIf="!loading && platforms.length > 0">
        <mat-card 
          *ngFor="let platform of platforms" 
          class="platform-card"
          [class.best-price]="platform.isBestPrice"
          [class.out-of-stock]="!platform.isInStock">
          
          <mat-card-header class="platform-header">
            <div mat-card-avatar>
              <img *ngIf="platform.logoUrl" 
                   [src]="platform.logoUrl" 
                   [alt]="platform.displayName"
                   class="platform-logo">
              <mat-icon *ngIf="!platform.logoUrl" class="default-icon">storefront</mat-icon>
            </div>
            <mat-card-title class="platform-name">
              {{ platform.displayName }}
            </mat-card-title>
            <mat-card-subtitle class="platform-platform">
              {{ getPlatformDisplayName(platform.platformName) }}
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content class="price-info">
            <!-- Best Price Badge -->
            <div *ngIf="platform.isBestPrice" class="best-price-badge">
              <mat-icon>star</mat-icon>
              Melhor Preço
            </div>

            <!-- Price -->
            <div class="price">
              <span class="currency">{{ platform.currency }}</span>
              <span class="amount">{{ platform.currentPrice | currency:'BRL':'symbol' }}</span>
            </div>

            <!-- Stock Info -->
            <div class="stock-info" [class.in-stock]="platform.isInStock" [class.out-of-stock]="!platform.isInStock">
              <mat-icon *ngIf="platform.isInStock">check_circle</mat-icon>
              <mat-icon *ngIf="!platform.isInStock">remove_circle</mat-icon>
              <span *ngIf="platform.isInStock && platform.stock">
                {{ platform.stock }} em estoque
              </span>
              <span *ngIf="platform.isInStock && !platform.stock">
                Em estoque
              </span>
              <span *ngIf="!platform.isInStock">
                Sem estoque
              </span>
            </div>

            <!-- Additional Info -->
            <div class="additional-info" *ngIf="platform.rating || platform.deliveryDays">
              <div class="rating" *ngIf="platform.rating">
                <mat-icon class="star-icon">star</mat-icon>
                <span>{{ platform.rating.toFixed(1) }}</span>
                <span *ngIf="platform.reviewCount" class="review-count">
                  ({{ platform.reviewCount }} avaliações)
                </span>
              </div>
              <div class="delivery" *ngIf="platform.deliveryDays">
                <mat-icon>local_shipping</mat-icon>
                <span>{{ platform.deliveryDays }} dias úteis</span>
              </div>
              <div class="shipping" *ngIf="platform.hasFreeShipping">
                <mat-icon>local_offer</mat-icon>
                <span>Frete Grátis</span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions class="action-buttons">
            <button mat-raised-button 
                    color="primary"
                    class="buy-button"
                    (click)="buyOnPlatform(platform)"
                    [disabled]="!platform.isInStock">
              <mat-icon>shopping_cart</mat-icon>
              Comprar na {{ platform.displayName }}
            </button>
            
            <button *ngIf="platform.hasDiscount" 
                    mat-stroked-button 
                    color="accent"
                    class="discount-button">
              <mat-icon>percent</mat-icon>
              {{ platform.discountPercentage }}% OFF
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- No Platforms Found -->
      <div class="no-platforms" *ngIf="!loading && platforms.length === 0">
        <mat-icon class="no-results-icon">search_off</mat-icon>
        <h3>Nenhuma oferta encontrada</h3>
        <p>Este produto não está disponível em nossas lojas parceiras no momento.</p>
      </div>

      <!-- Custom Link Section -->
      <div class="custom-link-section" *ngIf="showCustomLink && customAffiliateUrl">
        <mat-card class="custom-link-card">
          <mat-card-content>
            <h3>Link Personalizado</h3>
            <p>Use nosso link personalizado para comprar:</p>
            <div class="custom-link-container">
              <input matInput 
                     readonly 
                     [value]="customAffiliateUrl"
                     class="custom-link-input">
              <button mat-icon-button 
                      (click)="copyCustomLink()"
                      matTooltip="Copiar link"
                      class="copy-button">
                <mat-icon>content_copy</mat-icon>
              </button>
            </div>
            <div class="copy-feedback" *ngIf="linkCopied">
              <mat-icon color="primary">check_circle</mat-icon>
              Link copiado!
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./affiliate-comparison.component.scss']
})
export class AffiliateComparisonComponent {
  @Input() productId?: number;
  @Input() productName?: string;
  @Input() showCustomLink: boolean = false;
  @Input() customAffiliateUrl?: string;
  
  @Output() platformSelected = new EventEmitter<PlatformComparisonDTO>();

  platforms: PlatformComparisonDTO[] = [];
  loading = false;
  linkCopied = false;

  constructor(private affiliateService: AffiliateService) {}

  ngOnInit() {
    if (this.productId) {
      this.loadPlatformComparisons();
    }
  }

  loadPlatformComparisons() {
    this.loading = true;
    this.affiliateService.compareProductPrices(this.productId!).subscribe({
      next: (platforms) => {
        this.platforms = platforms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading platform comparisons:', error);
        this.loading = false;
      }
    });
  }

  buyOnPlatform(platform: PlatformComparisonDTO) {
    // Track click and open affiliate link
    this.affiliateService.openAffiliateLink(platform);
    this.platformSelected.emit(platform);
  }

  getPlatformDisplayName(platformName: string): string {
    const displayNames: { [key: string]: string } = {
      'AMAZON': 'Amazon',
      'MERCADO_LIVRE': 'Mercado Livre',
      'HOTMART': 'Hotmart',
      'MONETIZZE': 'Monetizze',
      'EDUZZ': 'Eduzz',
      'Americanas': 'Americanas',
      'Magazine_Luiza': 'Magazine Luiza',
      'Casas_BAHIA': 'Casas Bahia',
      'SHOPEE': 'Shopee',
      'AliExpress': 'AliExpress',
      'NETSHOES': 'Netshoes',
      'Dafiti': 'Dafiti',
      'Custom_Platform': 'Outra Plataforma'
    };
    return displayNames[platformName] || platformName;
  }

  copyCustomLink() {
    if (this.customAffiliateUrl) {
      navigator.clipboard.writeText(this.customAffiliateUrl).then(() => {
        this.linkCopied = true;
        setTimeout(() => {
          this.linkCopied = false;
        }, 3000);
      });
    }
  }
}