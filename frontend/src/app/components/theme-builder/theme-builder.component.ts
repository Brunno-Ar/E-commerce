import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';
import { Theme } from '../../models/theme.model';

@Component({
  selector: 'app-theme-builder',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatCardModule,
    MatTabsModule
  ],
  template: `
    <div class="theme-builder-container">
      <!-- Toolbar -->
      <mat-toolbar class="builder-toolbar">
        <button mat-icon-button (click)="toggleSidebar()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="toolbar-title">Theme Builder</span>
        <span class="spacer"></span>
        <button mat-stroked-button (click)="previewMode = !previewMode">
          <mat-icon>{{ previewMode ? 'edit' : 'visibility' }}</mat-icon>
          {{ previewMode ? 'Edit Mode' : 'Preview Mode' }}
        </button>
        <button mat-raised-button color="primary" (click)="saveTheme()">
          <mat-icon>save</mat-icon>
          Save Theme
        </button>
      </mat-toolbar>

      <div class="builder-content">
        <!-- Sidebar with Components -->
        <mat-sidenav #sidebar mode="side" opened class="component-sidebar">
          <div class="sidebar-header">
            <h3>Components</h3>
            <button mat-icon-button (click)="sidebar.toggle()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <mat-tab-group class="component-tabs">
            <!-- Layout Components -->
            <mat-tab label="Layout">
              <mat-accordion class="component-accordion">
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Header</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="component-list">
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'header', name: 'Main Header', icon: 'header' }">
                      <mat-icon>header</mat-icon>
                      <span>Main Header</span>
                    </div>
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'header', name: 'Sticky Header', icon: 'vertical_align_top' }">
                      <mat-icon>vertical_align_top</mat-icon>
                      <span>Sticky Header</span>
                    </div>
                  </div>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Hero Section</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="component-list">
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'hero', name: 'Hero Banner', icon: 'image' }">
                      <mat-icon>image</mat-icon>
                      <span>Hero Banner</span>
                    </div>
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'hero', name: 'Video Hero', icon: 'videocam' }">
                      <mat-icon>videocam</mat-icon>
                      <span>Video Hero</span>
                    </div>
                  </div>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Footer</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="component-list">
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'footer', name: 'Simple Footer', icon: 'horizontal_rule' }">
                      <mat-icon>horizontal_rule</mat-icon>
                      <span>Simple Footer</span>
                    </div>
                  </div>
                </mat-expansion-panel>
              </mat-accordion>
            </mat-tab>

            <!-- Content Components -->
            <mat-tab label="Content">
              <mat-accordion class="component-accordion">
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Products</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="component-list">
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'products', name: 'Product Grid', icon: 'grid_view' }">
                      <mat-icon>grid_view</mat-icon>
                      <span>Product Grid</span>
                    </div>
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'products', name: 'Featured Products', icon: 'star' }">
                      <mat-icon>star</mat-icon>
                      <span>Featured Products</span>
                    </div>
                  </div>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Content Blocks</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="component-list">
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'text', name: 'Text Block', icon: 'text_fields' }">
                      <mat-icon>text_fields</mat-icon>
                      <span>Text Block</span>
                    </div>
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'image', name: 'Image Gallery', icon: 'collections' }">
                      <mat-icon>collections</mat-icon>
                      <span>Image Gallery</span>
                    </div>
                  </div>
                </mat-expansion-panel>
              </mat-accordion>
            </mat-tab>

            <!-- Navigation -->
            <mat-tab label="Navigation">
              <mat-accordion class="component-accordion">
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>Menus</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div class="component-list">
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'navigation', name: 'Main Menu', icon: 'menu' }">
                      <mat-icon>menu</mat-icon>
                      <span>Main Menu</span>
                    </div>
                    <div class="draggable-component" 
                         cdkDrag 
                         [cdkDragData]="{ type: 'navigation', name: 'Breadcrumbs', icon: 'chevron_right' }">
                      <mat-icon>chevron_right</mat-icon>
                      <span>Breadcrumbs</span>
                    </div>
                  </div>
                </mat-expansion-panel>
              </mat-accordion>
            </mat-tab>
          </mat-tab-group>

          <!-- Theme Settings -->
          <div class="theme-settings">
            <h4>Theme Settings</h4>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Theme Name</mat-label>
              <input matInput [(ngModel)]="currentTheme.name">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput [(ngModel)]="currentTheme.description"></textarea>
            </mat-form-field>
          </div>
        </mat-sidenav>

        <!-- Main Canvas -->
        <mat-sidenav-content class="builder-canvas">
          <div class="canvas-container">
            <!-- Drop Zone -->
            <div class="canvas-drop-zone"
                 cdkDropList
                 (cdkDropListDropped)="onDrop($event)"
                 [class.preview-mode]="previewMode">
              
              <!-- Canvas Sections -->
              <div class="canvas-sections">
                <div *ngFor="let section of sections; trackBy: trackByFn" 
                     class="canvas-section"
                     [class.preview-mode]="previewMode"
                     [class.draggable]="!previewMode"
                     [cdkDrag]="!previewMode && !section.locked"
                     [cdkDragBoundary]="'.canvas-drop-zone'"
                     [cdkDragData]="section"
                     (cdkDragEnded)="onSectionDragEnd($event)">
                  
                  <app-section-renderer 
                    [section]="section" 
                    [previewMode]="previewMode"
                    (edit)="editSection(section)"
                    (delete)="deleteSection(section)">
                  </app-section-renderer>
                </div>
              </div>

              <!-- Empty State -->
              <div *ngIf="sections.length === 0" class="empty-canvas">
                <mat-icon class="empty-icon">dashboard_customize</mat-icon>
                <h3>Start Building Your Theme</h3>
                <p>Drag components from the sidebar to begin creating your custom theme</p>
              </div>
            </div>
          </div>

          <!-- Canvas Properties Panel -->
          <div class="canvas-properties" *ngIf="!previewMode">
            <h4>Canvas Settings</h4>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Container Width</mat-label>
              <mat-select [(ngModel)]="canvasSettings.containerWidth">
                <mat-option value="1200px">1200px (Default)</mat-option>
                <mat-option value="1400px">1400px (Large)</mat-option>
                <mat-option value="100%">100% (Full Width)</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Background Color</mat-label>
              <input matInput type="color" [(ngModel)]="canvasSettings.backgroundColor">
            </mat-form-field>
          </div>
        </mat-sidenav-content>
      </div>
    </div>
  `,
  styleUrls: ['./theme-builder.component.scss']
})
export class ThemeBuilderComponent implements OnInit, OnDestroy {
  currentTheme: Theme;
  sections: any[] = [];
  previewMode = false;
  sidebarOpened = true;
  
  canvasSettings = {
    containerWidth: '1200px',
    backgroundColor: '#ffffff'
  };

  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {
    this.currentTheme = {
      id: 0,
      name: 'New Theme',
      description: '',
      themeKey: '',
      isActive: false,
      isPublished: false,
      createdBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  ngOnInit() {
    // Initialize with empty sections or load existing theme
    this.loadOrCreateTheme();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  loadOrCreateTheme() {
    // For now, initialize with empty sections
    // In a real implementation, this would load an existing theme
    this.sections = [];
  }

  onDrop(event: any) {
    if (event.previousContainer === event.container) {
      // Reorder sections within canvas
      const previousIndex = event.previousIndex;
      const currentIndex = event.currentIndex;
      
      if (previousIndex !== currentIndex) {
        const draggedSection = this.sections[previousIndex];
        this.sections.splice(previousIndex, 1);
        this.sections.splice(currentIndex, 0, draggedSection);
      }
    } else {
      // Add new component from sidebar
      const componentData = event.item.data;
      if (componentData && componentData.type) {
        this.addSection(componentData);
      }
    }
  }

  onSectionDragEnd(event: any) {
    // Handle section drag end if needed
    console.log('Section drag ended:', event);
  }

  addSection(componentData: any) {
    const newSection = {
      id: Date.now(),
      type: componentData.type,
      name: componentData.name,
      config: {},
      locked: false,
      visible: true
    };

    this.sections.push(newSection);
  }

  editSection(section: any) {
    // Open section editor
    console.log('Edit section:', section);
  }

  deleteSection(section: any) {
    const index = this.sections.findIndex(s => s.id === section.id);
    if (index > -1) {
      this.sections.splice(index, 1);
    }
  }

  saveTheme() {
    // Save theme logic
    console.log('Saving theme:', this.currentTheme, this.sections);
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
}