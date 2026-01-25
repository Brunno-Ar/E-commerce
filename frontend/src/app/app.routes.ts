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
        path: 'admin/orders',
        component: AdminDashboardComponent, // TODO: Create OrdersComponent 
        canActivate: [adminGuard]
    },
    {
        path: 'admin/settings',
        component: AdminDashboardComponent, // TODO: Create SettingsComponent
        canActivate: [adminGuard]
    }
];
