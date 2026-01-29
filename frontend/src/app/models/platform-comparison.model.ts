import { PlatformName } from '../enums/platform-name.enum';

export interface PlatformComparisonDTO {
  id: number;
  platformName: PlatformName;
  platformUrl: string;
  currentPrice: number;
  stock?: number;
  currency: string;
  logoUrl?: string;
  displayName: string;
  isBestPrice: boolean;
  isInStock: boolean;
  affiliateUrl: string;
  trackingParams?: string;
  lastSync?: Date;
  shippingCost?: number;
  deliveryDays?: number;
  rating?: number;
  reviewCount?: number;
  hasFreeShipping?: boolean;
  hasDiscount?: boolean;
  discountPercentage?: number;
  
  // Make mutable for Java backend
  setIsBestPrice(value: boolean): void;
  setShippingCost(value: number): void;
  setDeliveryDays(value: number): void;
  setRating(value: number): void;
  setReviewCount(value: number): void;
  setHasFreeShipping(value: boolean): void;
  setHasDiscount(value: boolean): void;
  setDiscountPercentage(value: number): void;
}