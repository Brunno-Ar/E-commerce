export interface ThemeSettingsDTO {
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;

  // Typography
  fontFamily: string;
  fontSizeBase: string;

  // Spacing
  spacingUnit: string;

  // Border radius
  borderRadiusSmall: string;
  borderRadiusMedium: string;
  borderRadiusLarge: string;

  // Layout
  containerMaxWidth: string;
  headerHeight: string;
  footerHeight: string;

  // Generated CSS
  cssVariables?: string;
  
  // Preview data
  customFonts?: string[];
  useCustomFonts?: boolean;
}