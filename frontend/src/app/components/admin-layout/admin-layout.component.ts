import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';

interface NavItem {
    icon: string;
    label: string;
    route: string;
    badge?: number;
}

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule, MatRippleModule],
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
    sidebarOpen = signal(true);

    navItems: NavItem[] = [
        { icon: 'dashboard', label: 'Dashboard', route: '/admin' },
        { icon: 'inventory_2', label: 'Produtos', route: '/admin/products' },
        { icon: 'shopping_cart', label: 'Pedidos', route: '/admin/orders' },
        { icon: 'settings', label: 'Configurar Loja', route: '/admin/settings' }
    ];

    accountItems: NavItem[] = [
        { icon: 'storefront', label: 'Ver Loja', route: '/' },
        { icon: 'logout', label: 'Sair', route: '/logout' }
    ];

    constructor(
        public router: Router,
        public authService: AuthService
    ) { }

    toggleSidebar(): void {
        this.sidebarOpen.update(v => !v);
    }

    isActive(route: string): boolean {
        if (route === '/admin') {
            return this.router.url === '/admin';
        }
        return this.router.url.startsWith(route);
    }

    handleNavClick(item: NavItem): void {
        if (item.route === '/logout') {
            this.authService.logout();
        } else {
            this.router.navigate([item.route]);
        }
    }

    getUserName(): string {
        const user = this.authService.currentUser();
        return user?.name || 'Admin';
    }
}
