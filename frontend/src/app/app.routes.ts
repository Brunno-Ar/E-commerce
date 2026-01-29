import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { adminGuard } from './guards/admin.guard';

// Admin Components
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { ProductFormComponent } from './components/admin/product-form/product-form.component';

export const routes: Routes = [
    // Public Routes (Rendered inside AppComponent with Sidebar)
    { path: '', component: ProductListComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'my-orders', loadComponent: () => import('./components/client-orders/client-orders.component').then(m => m.ClientOrdersComponent) },
    { path: 'checkout/callback', loadComponent: () => import('./components/checkout-callback/checkout-callback.component').then(m => m.CheckoutCallbackComponent) },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Admin Routes (Directly rendered, no extra layout wrapper needed)
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'admin/products',
        component: AdminProductsComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'admin/products/new',
        component: ProductFormComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'admin/products/edit/:id',
        component: ProductFormComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'admin/categories',
        loadComponent: () => import('./components/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/orders',
        loadComponent: () => import('./components/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent),
        canActivate: [adminGuard]
    },
    {
        path: 'admin/settings',
        loadComponent: () => import('./components/admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent),
        canActivate: [adminGuard]
    }
];
