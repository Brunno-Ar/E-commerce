package com.bruno.backend.repository;

import com.bruno.backend.entity.ThemeSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ThemeSettingsRepository extends JpaRepository<ThemeSettings, Long> {
    
    Optional<ThemeSettings> findByThemeId(Long themeId);
}