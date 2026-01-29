package com.bruno.backend.controller;

import com.bruno.backend.dto.ThemeSettingsDTO;
import com.bruno.backend.entity.Theme;
import com.bruno.backend.service.ThemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/themes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ThemeController {

    private final ThemeService themeService;

    @GetMapping
    public ResponseEntity<List<Theme>> getAllThemes() {
        List<Theme> themes = themeService.getAllThemes();
        return ResponseEntity.ok(themes);
    }

    @GetMapping("/active")
    public ResponseEntity<Theme> getActiveTheme() {
        Optional<Theme> theme = themeService.getActiveTheme();
        return theme.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/settings/{themeId}")
    public ResponseEntity<ThemeSettingsDTO> getThemeSettings(@PathVariable Long themeId) {
        ThemeSettingsDTO settings = themeService.getThemeSettingsDTO(themeId);
        return ResponseEntity.ok(settings);
    }

    @GetMapping("/css/{themeId}")
    public ResponseEntity<String> getThemeCSS(@PathVariable Long themeId) {
        String css = themeService.generateCSSVariables(themeId);
        return ResponseEntity.ok(css);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Theme> createTheme(
            @RequestParam String name,
            @RequestParam(required = false) String description) {
        Theme theme = themeService.createTheme(name, description, "admin");
        return ResponseEntity.ok(theme);
    }

    @PutMapping("/{themeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Theme> updateTheme(
            @PathVariable Long themeId,
            @RequestParam String name,
            @RequestParam(required = false) String description) {
        Theme theme = themeService.updateTheme(themeId, name, description);
        return ResponseEntity.ok(theme);
    }

    @PostMapping("/{themeId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Theme> activateTheme(@PathVariable Long themeId) {
        Theme theme = themeService.activateTheme(themeId);
        return ResponseEntity.ok(theme);
    }

    @PutMapping("/{themeId}/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ThemeSettingsDTO> updateThemeSettings(
            @PathVariable Long themeId,
            @RequestBody ThemeSettingsDTO settingsDTO) {
        var settings = themeService.updateThemeSettings(themeId, settingsDTO);
        return ResponseEntity.ok(settingsDTO);
    }

    @DeleteMapping("/{themeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTheme(@PathVariable Long themeId) {
        themeService.deleteTheme(themeId);
        return ResponseEntity.noContent().build();
    }
}