import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'my-orders', loadComponent: () => import('./components/client-orders/client-orders.component').then(m => m.ClientOrdersComponent) },
    { path: 'checkout/callback', loadComponent: () => import('./components/checkout-callback/checkout-callback.component').then(m => m.CheckoutCallbackComponent) },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];