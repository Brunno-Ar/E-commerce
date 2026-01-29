import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EcommerceService } from '../../services/ecommerce.service';
import { SiteConfig } from '../../models/site-config.model';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
    ecommerceService = inject(EcommerceService);
    config: SiteConfig | null = null;

    ngOnInit(): void {
        this.ecommerceService.getConfig().subscribe(config => {
            this.config = config;
        });
    }
}
