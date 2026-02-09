import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';

import { Product } from '../../models/product.model';
import { EcommerceService } from '../../services/ecommerce.service';
import { CartService } from '../../services/cart.service';
import { HeroComponent } from '../hero/hero.component';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatGridListModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        HeroComponent
    ],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
    private ecommerceService = inject(EcommerceService);
    private cartService = inject(CartService);

    // Filters
    searchControl = new FormControl('');
    private categorySubject = new BehaviorSubject<number | undefined>(undefined);
    private pageSubject = new BehaviorSubject<number>(0);
    private pageSize = 8;

    // Data streams
    categories$ = this.ecommerceService.getCategories();

    private destroyRef = inject(DestroyRef);

    private productsPage$ = combineLatest([
        this.categorySubject.pipe(distinctUntilChanged()),
        this.searchControl.valueChanges.pipe(
            startWith(''),
            debounceTime(500),
            distinctUntilChanged(),
            tap(() => this.pageSubject.next(0))
        ),
        this.pageSubject.pipe(distinctUntilChanged())
    ]).pipe(
        debounceTime(0), // Avoid glitch with pageSubject.next(0)
        tap(() => this.isLoading = true),
        switchMap(([categoryId, search, page]) =>
            this.ecommerceService.getProducts(categoryId, search || '', page, this.pageSize)
        )
    );

    products: Product[] = [];
    isLastPage = false;
    isLoading = false;

    constructor() {
        this.productsPage$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (pageData) => {
                    if (pageData.number === 0) {
                        this.products = pageData.content;
                    } else {
                        this.products = [...this.products, ...pageData.content];
                    }
                    this.isLastPage = pageData.last;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error loading products:', err);
                    this.isLoading = false;
                }
            });
    }

    get selectedCategoryId(): number | undefined {
        return this.categorySubject.value;
    }

    setCategory(categoryId?: number) {
        this.pageSubject.next(0); // Reset page on category change
        this.categorySubject.next(categoryId);
    }

    loadMore() {
        if (!this.isLastPage && !this.isLoading) {
            this.isLoading = true;
            this.pageSubject.next(this.pageSubject.value + 1);
        }
    }

    addToCart(product: Product) {
        this.cartService.addToCart(product);
    }

    openAffiliateLink(url?: string) {
        if (url) {
            window.open(url, '_blank');
        }
    }
}
