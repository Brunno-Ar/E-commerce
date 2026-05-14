import { Component, Inject, Renderer2, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    MatRippleModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Technoo';
  sidebarOpen = signal(true);
  currentRoute = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  public cartService = inject(CartService);

  storeItems: NavItem[] = [
    { icon: 'storefront', label: 'Loja', route: '/' },
    { icon: 'shopping_bag', label: 'Carrinho', route: '/checkout' }
  ];

  accountItems: NavItem[] = [
    { icon: 'login', label: 'Entrar', route: '/login' },
    { icon: 'person_add', label: 'Cadastrar', route: '/register' }
  ];

  loggedInItems: NavItem[] = [
    { icon: 'receipt_long', label: 'Meus Pedidos', route: '/my-orders' },
    { icon: 'logout', label: 'Sair', route: '/logout' }
  ];

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  isActive(route: string): boolean {
    if (route === '/' && this.currentRoute !== '/') return false;
    return this.currentRoute.startsWith(route);
  }

  handleNavClick(item: NavItem): void {
    if (item.route === '/logout') {
      this.authService.logout();
    } else {
      this.router.navigate([item.route]);
    }
  }

  getMainNavItems(): NavItem[] {
    const cartCount = this.cartService.getCount();
    const store = this.storeItems.map(item => {
      if (item.route === '/checkout') return { ...item, badge: cartCount > 0 ? cartCount : undefined };
      return item;
    });
    return store;
  }

  getAccountItems(): NavItem[] {
    if (this.authService.currentUser()) {
      return this.loggedInItems;
    }
    return this.accountItems;
  }

  getUserName(): string {
    const user = this.authService.currentUser();
    return user?.name || 'Visitante';
  }

  getPageTitle(): string {
    if (this.currentRoute === '/checkout') return 'Carrinho de Compras';
    if (this.currentRoute === '/login') return 'Login';
    if (this.currentRoute === '/register') return 'Cadastro';
    if (this.currentRoute === '/my-orders') return 'Meus Pedidos';
    return 'Technoo Store';
  }
}
