package com.bruno.backend.repository;

import com.bruno.backend.entity.Theme;
import com.bruno.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThemeRepository extends JpaRepository<Theme, Long> {
    
    List<Theme> findByCreatedBy(String createdBy);
    
    Optional<Theme> findByThemeKey(String themeKey);
    
    List<Theme> findByIsActiveTrue();
    
    Optional<Theme> findByIsPublishedTrue();
    
    Optional<Theme> findByIsPublishedTrueAndIsActiveTrue();
    
    boolean existsByThemeKey(String themeKey);
}