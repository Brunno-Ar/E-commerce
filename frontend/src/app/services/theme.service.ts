import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Theme } from '../models/theme.model';
import { ThemeSettingsDTO } from '../models/theme-settings.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private apiUrl = `${environment.apiUrl}/api/themes`;

  constructor(private http: HttpClient) { }

  getAllThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.apiUrl);
  }

  getActiveTheme(): Observable<Theme> {
    return this.http.get<Theme>(`${this.apiUrl}/active`);
  }

  getThemeSettings(themeId: number): Observable<ThemeSettingsDTO> {
    return this.http.get<ThemeSettingsDTO>(`${this.apiUrl}/settings/${themeId}`);
  }

  getThemeCSS(themeId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/css/${themeId}`, { responseType: 'text' });
  }

  createTheme(name: string, description?: string): Observable<Theme> {
    const params = new URLSearchParams();
    params.set('name', name);
    if (description) {
      params.set('description', description);
    }
    return this.http.post<Theme>(`${this.apiUrl}?${params.toString()}`, {});
  }

  updateTheme(themeId: number, name: string, description?: string): Observable<Theme> {
    const params = new URLSearchParams();
    params.set('name', name);
    if (description) {
      params.set('description', description);
    }
    return this.http.put<Theme>(`${this.apiUrl}/${themeId}?${params.toString()}`, {});
  }

  activateTheme(themeId: number): Observable<Theme> {
    return this.http.post<Theme>(`${this.apiUrl}/${themeId}/activate`, {});
  }

  updateThemeSettings(themeId: number, settings: ThemeSettingsDTO): Observable<ThemeSettingsDTO> {
    return this.http.put<ThemeSettingsDTO>(`${this.apiUrl}/${themeId}/settings`, settings);
  }

  deleteTheme(themeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${themeId}`);
  }

  // Apply theme CSS dynamically to the page
  applyThemeCSS(css: string): void {
    // Remove existing theme styles
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new theme styles
    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-theme-styles';
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }

  // Load and apply active theme
  loadAndApplyActiveTheme(): Observable<void> {
    return new Observable(observer => {
      this.getActiveTheme().subscribe({
        next: (theme) => {
          if (theme && theme.id) {
            this.getThemeCSS(theme.id).subscribe({
              next: (css) => {
                this.applyThemeCSS(css);
                observer.next();
                observer.complete();
              },
              error: (error) => {
                console.error('Error loading theme CSS:', error);
                observer.error(error);
              }
            });
          } else {
            observer.next();
            observer.complete();
          }
        },
        error: (error) => {
          console.error('Error loading active theme:', error);
          observer.error(error);
        }
      });
    });
  }
}