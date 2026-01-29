package com.bruno.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "themes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Theme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "theme_key", unique = true, nullable = false)
    private String themeKey;

    @Column(name = "is_active")
    private boolean isActive = false;

    @Column(name = "is_published")
    private boolean isPublished = false;

    @OneToMany(mappedBy = "theme", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ThemeSection> sections = new ArrayList<>();

    @OneToOne(mappedBy = "theme", cascade = CascadeType.ALL)
    private ThemeSettings settings;

    @Column(name = "preview_image")
    private String previewImage;

    @Column(name = "created_by")
    private String createdBy;

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