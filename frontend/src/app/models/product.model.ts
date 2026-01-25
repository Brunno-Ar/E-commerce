import { Category } from './category.model';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId?: number;
    category?: Category;
    isAffiliate?: boolean;
    affiliateUrl?: string;
}
