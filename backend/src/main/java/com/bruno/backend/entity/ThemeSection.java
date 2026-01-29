package com.bruno.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "theme_sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThemeSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theme_id")
    private Theme theme;

    @Column(name = "section_key", nullable = false)
    private String sectionKey;

    @Column(nullable = false)
    private String type;

    private String name;

    private Integer position;

    @Column(name = "is_visible")
    private boolean isVisible = true;

    @Column(name = "is_locked")
    private boolean isLocked = false;

    @Column(columnDefinition = "TEXT")
    private String config;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ThemeComponent> components = new ArrayList<>();

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