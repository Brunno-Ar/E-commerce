package com.bruno.backend.service;

import com.bruno.backend.dto.ThemeSettingsDTO;
import com.bruno.backend.entity.Theme;
import com.bruno.backend.entity.ThemeSettings;
import com.bruno.backend.repository.ThemeRepository;
import com.bruno.backend.repository.ThemeSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ThemeService {

    private final ThemeRepository themeRepository;
    private final ThemeSettingsRepository themeSettingsRepository;

    public List<Theme> getAllThemes() {
        return themeRepository.findAll();
    }

    public List<Theme> getActiveThemes() {
        return themeRepository.findByIsActiveTrue();
    }

    public Optional<Theme> getActiveTheme() {
        return themeRepository.findByIsPublishedTrueAndIsActiveTrue();
    }

    public Theme createTheme(String name, String description, String createdBy) {
        Theme theme = new Theme();
        theme.setName(name);
        theme.setDescription(description);
        theme.setThemeKey(generateThemeKey(name));
        theme.setCreatedBy(createdBy);
        theme.setActive(false);
        theme.setPublished(false);

        Theme savedTheme = themeRepository.save(theme);

        // Create default settings
        ThemeSettings settings = new ThemeSettings();
        settings.setTheme(savedTheme);
        themeSettingsRepository.save(settings);

        savedTheme.setSettings(settings);
        return themeRepository.save(savedTheme);
    }

    public Theme updateTheme(Long themeId, String name, String description) {
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new RuntimeException("Tema não encontrado"));

        theme.setName(name);
        theme.setDescription(description);
        theme.setThemeKey(generateThemeKey(name));

        return themeRepository.save(theme);
    }

    public void deleteTheme(Long themeId) {
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new RuntimeException("Tema não encontrado"));

        if (theme.isActive()) {
            throw new RuntimeException("Não é possível excluir um tema ativo");
        }

        themeRepository.delete(theme);
    }

    public Theme activateTheme(Long themeId) {
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new RuntimeException("Tema não encontrado"));

        // Deactivate all other themes
        themeRepository.findByIsActiveTrue()
                .forEach(activeTheme -> {
                    activeTheme.setActive(false);
                    themeRepository.save(activeTheme);
                });

        theme.setActive(true);
        theme.setPublished(true);
        return themeRepository.save(theme);
    }

    public ThemeSettings updateThemeSettings(Long themeId, ThemeSettingsDTO settingsDTO) {
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new RuntimeException("Tema não encontrado"));

        ThemeSettings settings = theme.getSettings();
        if (settings == null) {
            settings = new ThemeSettings();
            settings.setTheme(theme);
        }

        // Update colors
        settings.setPrimaryColor(settingsDTO.getPrimaryColor());
        settings.setSecondaryColor(settingsDTO.getSecondaryColor());
        settings.setAccentColor(settingsDTO.getAccentColor());
        settings.setBackgroundColor(settingsDTO.getBackgroundColor());
        settings.setSurfaceColor(settingsDTO.getSurfaceColor());
        settings.setTextPrimaryColor(settingsDTO.getTextPrimaryColor());
        settings.setTextSecondaryColor(settingsDTO.getTextSecondaryColor());

        // Update typography
        settings.setFontFamily(settingsDTO.getFontFamily());
        settings.setFontSizeBase(settingsDTO.getFontSizeBase());

        // Update spacing
        settings.setSpacingUnit(settingsDTO.getSpacingUnit());

        // Update border radius
        settings.setBorderRadiusSmall(settingsDTO.getBorderRadiusSmall());
        settings.setBorderRadiusMedium(settingsDTO.getBorderRadiusMedium());
        settings.setBorderRadiusLarge(settingsDTO.getBorderRadiusLarge());

        // Update layout
        settings.setContainerMaxWidth(settingsDTO.getContainerMaxWidth());
        settings.setHeaderHeight(settingsDTO.getHeaderHeight());
        settings.setFooterHeight(settingsDTO.getFooterHeight());

        ThemeSettings savedSettings = themeSettingsRepository.save(settings);

        // Generate CSS variables
        String cssVariables = generateCSSVariables(savedSettings);
        settingsDTO.setCssVariables(cssVariables);

        return savedSettings;
    }

    public String generateCSSVariables(Long themeId) {
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new RuntimeException("Tema não encontrado"));

        ThemeSettings settings = theme.getSettings();
        if (settings == null) {
            return "";
        }

        return generateCSSVariables(settings);
    }

    private String generateCSSVariables(ThemeSettings settings) {
        return String.format("""
                :root {
                    --color-primary: %s;
                    --color-secondary: %s;
                    --color-accent: %s;
                    --color-background: %s;
                    --color-surface: %s;
                    --color-text-primary: %s;
                    --color-text-secondary: %s;

                    --font-family: %s;
                    --font-size-base: %s;

                    --spacing-unit: %s;

                    --border-radius-sm: %s;
                    --border-radius-md: %s;
                    --border-radius-lg: %s;

                    --container-max-width: %s;
                    --header-height: %s;
                    --footer-height: %s;
                }
                """,
                settings.getPrimaryColor(),
                settings.getSecondaryColor(),
                settings.getAccentColor(),
                settings.getBackgroundColor(),
                settings.getSurfaceColor(),
                settings.getTextPrimaryColor(),
                settings.getTextSecondaryColor(),
                settings.getFontFamily(),
                settings.getFontSizeBase(),
                settings.getSpacingUnit(),
                settings.getBorderRadiusSmall(),
                settings.getBorderRadiusMedium(),
                settings.getBorderRadiusLarge(),
                settings.getContainerMaxWidth(),
                settings.getHeaderHeight(),
                settings.getFooterHeight()).trim();
    }

    private String generateThemeKey(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "") + "-" + System.currentTimeMillis();
    }

    public ThemeSettingsDTO getThemeSettingsDTO(Long themeId) {
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new RuntimeException("Tema não encontrado"));

        ThemeSettings settings = theme.getSettings();
        if (settings == null) {
            return new ThemeSettingsDTO();
        }

        ThemeSettingsDTO dto = new ThemeSettingsDTO();
        dto.setPrimaryColor(settings.getPrimaryColor());
        dto.setSecondaryColor(settings.getSecondaryColor());
        dto.setAccentColor(settings.getAccentColor());
        dto.setBackgroundColor(settings.getBackgroundColor());
        dto.setSurfaceColor(settings.getSurfaceColor());
        dto.setTextPrimaryColor(settings.getTextPrimaryColor());
        dto.setTextSecondaryColor(settings.getTextSecondaryColor());
        dto.setFontFamily(settings.getFontFamily());
        dto.setFontSizeBase(settings.getFontSizeBase());
        dto.setSpacingUnit(settings.getSpacingUnit());
        dto.setBorderRadiusSmall(settings.getBorderRadiusSmall());
        dto.setBorderRadiusMedium(settings.getBorderRadiusMedium());
        dto.setBorderRadiusLarge(settings.getBorderRadiusLarge());
        dto.setContainerMaxWidth(settings.getContainerMaxWidth());
        dto.setHeaderHeight(settings.getHeaderHeight());
        dto.setFooterHeight(settings.getFooterHeight());

        // Generate CSS variables
        dto.setCssVariables(generateCSSVariables(settings));

        return dto;
    }
}