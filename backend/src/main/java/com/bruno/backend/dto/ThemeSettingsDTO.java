package com.bruno.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThemeSettingsDTO {
    // Colors
    private String primaryColor = "#3f51b5";
    private String secondaryColor = "#ff4081";
    private String accentColor = "#4caf50";
    private String backgroundColor = "#ffffff";
    private String surfaceColor = "#f5f5f5";
    private String textPrimaryColor = "#212121";
    private String textSecondaryColor = "#757575";

    // Typography
    private String fontFamily = "Roboto, sans-serif";
    private String fontSizeBase = "16px";

    // Spacing
    private String spacingUnit = "8px";

    // Border radius
    private String borderRadiusSmall = "4px";
    private String borderRadiusMedium = "8px";
    private String borderRadiusLarge = "12px";

    // Layout
    private String containerMaxWidth = "1200px";
    private String headerHeight = "64px";
    private String footerHeight = "200px";

    // Generated CSS
    private String cssVariables;
    
    // Preview data
    private List<String> customFonts;
    private boolean useCustomFonts = false;
}