import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlatformComparisonDTO } from '../models/platform-comparison.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffiliateService {
  private apiUrl = `${environment.apiUrl}/api/affiliate`;

  constructor(private http: HttpClient) { }

  compareProductPrices(productId: number): Observable<PlatformComparisonDTO[]> {
    return this.http.get<PlatformComparisonDTO[]>(`${this.apiUrl}/compare/${productId}`);
  }

  getBestPrice(productId: number): Observable<PlatformComparisonDTO> {
    return this.http.get<PlatformComparisonDTO>(`${this.apiUrl}/best-price/${productId}`);
  }

  recordClick(platformId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/click/${platformId}`, {});
  }

  recordConversion(platformId: number, commission?: number): Observable<void> {
    let params = '';
    if (commission) {
      params = `?commission=${commission}`;
    }
    return this.http.post<void>(`${this.apiUrl}/conversion/${platformId}${params}`, {});
  }

  getByPlatform(platformName: string): Observable<PlatformComparisonDTO[]> {
    return this.http.get<PlatformComparisonDTO[]>(`${this.apiUrl}/platform/${platformName}`);
  }

  openAffiliateLink(platform: PlatformComparisonDTO): void {
    // Record click first
    this.recordClick(platform.id).subscribe(() => {
      // Open affiliate link in new tab
      if (platform.affiliateUrl) {
        window.open(platform.affiliateUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }
}