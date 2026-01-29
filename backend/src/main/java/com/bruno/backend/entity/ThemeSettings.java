package com.bruno.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "theme_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThemeSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theme_id")
    private Theme theme;

    // Colors
    @Column(name = "primary_color")
    private String primaryColor = "#3f51b5";

    @Column(name = "secondary_color")
    private String secondaryColor = "#ff4081";

    @Column(name = "accent_color")
    private String accentColor = "#4caf50";

    @Column(name = "background_color")
    private String backgroundColor = "#ffffff";

    @Column(name = "surface_color")
    private String surfaceColor = "#f5f5f5";

    @Column(name = "text_primary_color")
    private String textPrimaryColor = "#212121";

    @Column(name = "text_secondary_color")
    private String textSecondaryColor = "#757575";

    // Typography
    @Column(name = "font_family")
    private String fontFamily = "Roboto, sans-serif";

    @Column(name = "font_size_base")
    private String fontSizeBase = "16px";

    // Spacing
    @Column(name = "spacing_unit")
    private String spacingUnit = "8px";

    // Border radius
    @Column(name = "border_radius_small")
    private String borderRadiusSmall = "4px";

    @Column(name = "border_radius_medium")
    private String borderRadiusMedium = "8px";

    @Column(name = "border_radius_large")
    private String borderRadiusLarge = "12px";

    // Layout
    @Column(name = "container_max_width")
    private String containerMaxWidth = "1200px";

    @Column(name = "header_height")
    private String headerHeight = "64px";

    @Column(name = "footer_height")
    private String footerHeight = "200px";

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    private void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    private void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}