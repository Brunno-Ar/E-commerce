package com.bruno.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "theme_components")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThemeComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private ThemeSection section;

    @Column(name = "component_key", nullable = false)
    private String componentKey;

    @Column(nullable = false)
    private String type;

    private String name;

    private Integer position;

    @Column(columnDefinition = "TEXT")
    private String config;

    @Column(name = "slot_name")
    private String slotName;

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