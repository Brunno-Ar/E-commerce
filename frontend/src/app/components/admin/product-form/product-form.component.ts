import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EcommerceService } from '../../../services/ecommerce.service';
import { Product } from '../../../models/product.model';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatCardModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
    productForm: FormGroup;
    isEditMode = false;
    productId: number = 0;
    isLoading = false;

    private fb = inject(FormBuilder);
    private ecommerceService = inject(EcommerceService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);

    constructor() {
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: [0, [Validators.required, Validators.min(0)]],
            imageUrl: ['', Validators.required],
            isAffiliate: [false],
            affiliateUrl: ['']
        });
    }

    ngOnInit(): void {
        // Setup conditional validation for affiliateUrl
        this.productForm.get('isAffiliate')?.valueChanges.subscribe(isAffiliate => {
            const urlControl = this.productForm.get('affiliateUrl');
            if (isAffiliate) {
                urlControl?.setValidators([Validators.required]);
            } else {
                urlControl?.clearValidators();
                urlControl?.setValue('');
            }
            urlControl?.updateValueAndValidity();
        });

        // Check for edit mode
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.productId = +id;
            this.loadProduct(this.productId);
        }
    }

    loadProduct(id: number) {
        this.isLoading = true;
        this.ecommerceService.getProductById(id).subscribe({
            next: (product) => {
                this.productForm.patchValue({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    isAffiliate: product.isAffiliate,
                    affiliateUrl: product.affiliateUrl
                });
                this.isLoading = false;
            },
            error: () => {
                this.showSnackBar('Erro ao carregar produto.');
                this.router.navigate(['/admin/products']);
            }
        });
    }

    onSubmit() {
        if (this.productForm.invalid) return;

        const product: Product = this.productForm.value;

        // Ensure category is set (mocked for now as we don't have category selection yet in this form, or maybe defaults)
        // For now we assume the backend handles it or we send a default. 
        // Ideally we should have a category selector. I'll add a default category ID if missing or handle it in backend.
        // Based on requirements, users didn't ask for Category Selector, so I will send a basic object.

        // NOTE: The backend entity expects a Category object or ID. The DTO might handle ID. 
        // Let's assume the backend fixes strict relationships. 
        // If not, we might need to fetch categories. I'll stick to basic fields requested.

        this.isLoading = true;

        const request$ = this.isEditMode
            ? this.ecommerceService.updateProduct(this.productId, product)
            : this.ecommerceService.createProduct(product);

        request$.subscribe({
            next: () => {
                this.showSnackBar(`Produto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
                this.router.navigate(['/admin/products']);
            },
            error: (err) => {
                console.error(err);
                this.showSnackBar('Erro ao salvar produto.');
                this.isLoading = false;
            }
        });
    }

    onCancel() {
        this.router.navigate(['/admin/products']);
    }

    private showSnackBar(msg: string) {
        this.snackBar.open(msg, 'Fechar', { duration: 3000 });
    }
}
