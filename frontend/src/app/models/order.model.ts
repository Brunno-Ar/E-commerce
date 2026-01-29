import { Product } from './product.model';

export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: number;
    dateTime: string;
    status: 'PENDING' | 'PAID' | 'CANCELED'; // Add other statuses if needed
    totalValue: number;
    items: OrderItem[];
}
