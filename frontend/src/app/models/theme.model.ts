import { ThemeSettingsDTO } from './theme-settings.model';

export interface Theme {
  id: number;
  name: string;
  description?: string;
  themeKey: string;
  isActive: boolean;
  isPublished: boolean;
  previewImage?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  sections?: any[];
  settings?: ThemeSettingsDTO;
}

export interface ThemeSection {
  id: number;
  sectionKey: string;
  type: string;
  name?: string;
  position?: number;
  isVisible: boolean;
  isLocked: boolean;
  config?: string;
  components?: ThemeComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeComponent {
  id: number;
  componentKey: string;
  type: string;
  name?: string;
  position?: number;
  config?: string;
  slotName?: string;
  createdAt: Date;
  updatedAt: Date;
}