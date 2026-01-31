package com.bruno.backend.service;

import com.bruno.backend.entity.Theme;
import com.bruno.backend.repository.ThemeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class ThemeServiceBenchmarkTest {

    @Autowired
    private ThemeService themeService;

    @Autowired
    private ThemeRepository themeRepository;

    @Test
    public void benchmarkActivateTheme() {
        int themeCount = 1000;

        // Setup: Create themes and make them active
        for (int i = 0; i < themeCount; i++) {
            Theme theme = themeService.createTheme("Theme " + i, "Description " + i, "User");
            theme.setActive(true);
            themeRepository.save(theme);
        }

        // Make sure everything is in DB
        themeRepository.flush();

        // Pick one to activate (it's already active, but the logic will deactivate others)
        // Wait, if I pick one that is active, the logic:
        // 1. findByIsActiveTrue() -> returns all 1000 (including the one we picked)
        // 2. loop sets active=false and saves.
        // 3. sets target active=true and saves.

        // Effectively it deactivates everything and then reactivates the target.

        Theme targetTheme = themeRepository.findAll().get(0);

        System.out.println("Starting benchmark with " + themeCount + " active themes...");

        // Measure
        long startTime = System.nanoTime();
        themeService.activateTheme(targetTheme.getId());
        long endTime = System.nanoTime();

        double durationMs = (endTime - startTime) / 1_000_000.0;
        System.out.println("BENCHMARK_RESULT: Execution time: " + durationMs + " ms");

        // Verify correctness
        List<Theme> activeThemes = themeRepository.findByIsActiveTrue();
        if (activeThemes.size() != 1) {
            throw new RuntimeException("Expected 1 active theme, found " + activeThemes.size());
        }
        if (!activeThemes.get(0).getId().equals(targetTheme.getId())) {
            throw new RuntimeException("Wrong active theme activated");
        }
    }
}
