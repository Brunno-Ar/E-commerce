import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';

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

    // Data streams
    categories$ = this.ecommerceService.getCategories();

    products$ = combineLatest([
        this.categorySubject,
        this.searchControl.valueChanges.pipe(
            startWith(''),
            debounceTime(500)
        )
    ]).pipe(
        switchMap(([categoryId, search]) =>
            this.ecommerceService.getProducts(categoryId, search || '')
        )
    );

    get selectedCategoryId(): number | undefined {
        return this.categorySubject.value;
    }

    setCategory(categoryId?: number) {
        this.categorySubject.next(categoryId);
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
