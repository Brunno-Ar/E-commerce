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

  // Menus definidos dinamicamente
  adminItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/admin' },
    { icon: 'inventory_2', label: 'Produtos', route: '/admin/products' },
    { icon: 'shopping_cart', label: 'Pedidos', route: '/admin/orders' },
    { icon: 'settings', label: 'Configurar Loja', route: '/admin/settings' }
  ];

  storeItems: NavItem[] = [
    { icon: 'storefront', label: 'Loja', route: '/' },
    { icon: 'shopping_bag', label: 'Carrinho', route: '/checkout' } // Badge será atualizado dinamicamente
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
    // Escuta mudanças de rota para destacar link ativo
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

  // Retorna os itens principais baseado no role
  getMainNavItems(): NavItem[] {
    if (this.isAdmin()) {
      return [...this.adminItems, ...this.storeItems];
    }
    // Atualiza badge do carrinho
    const cartCount = this.cartService.getCount();
    const store = this.storeItems.map(item => {
      if (item.route === '/checkout') return { ...item, badge: cartCount > 0 ? cartCount : undefined };
      return item;
    });
    return store;
  }

  // Retorna itens de conta
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

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getPageTitle(): string {
    if (this.currentRoute.startsWith('/admin/products')) return 'Gerenciar Produtos';
    if (this.currentRoute.startsWith('/admin/orders')) return 'Gerenciar Pedidos';
    if (this.currentRoute.startsWith('/admin/categories')) return 'Gerenciar Categorias';
    if (this.currentRoute.startsWith('/admin/settings')) return 'Configurações da Loja';
    if (this.currentRoute.startsWith('/admin')) return 'Painel Administrativo';
    if (this.currentRoute === '/checkout') return 'Carrinho de Compras';
    if (this.currentRoute === '/login') return 'Login';
    if (this.currentRoute === '/register') return 'Cadastro';
    if (this.currentRoute === '/my-orders') return 'Meus Pedidos';
    return 'Technoo Store';
  }
}
