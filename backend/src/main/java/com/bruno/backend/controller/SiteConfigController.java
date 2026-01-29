package com.bruno.backend.controller;

import com.bruno.backend.entity.SiteConfig;
import com.bruno.backend.repository.SiteConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor
public class SiteConfigController {

    private final SiteConfigRepository siteConfigRepository;

    /**
     * Retorna a configuração atual do site.
     * Como só existirá uma config, sempre retornamos a primeira encontrada.
     */
    @GetMapping
    public ResponseEntity<SiteConfig> getConfig() {
        return siteConfigRepository.findAll().stream()
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Atualiza a configuração do site (apenas ADMIN).
     * Se não existir, cria. Se existir, atualiza.
     */
    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SiteConfig> updateConfig(@RequestBody SiteConfig newConfig) {
        SiteConfig config = siteConfigRepository.findAll().stream()
                .findFirst()
                .orElse(new SiteConfig());

        config.setHeroTitle(newConfig.getHeroTitle());
        config.setHeroSubtitle(newConfig.getHeroSubtitle());
        config.setHeroImageUrl(newConfig.getHeroImageUrl());

        SiteConfig savedMatches = siteConfigRepository.save(config);
        return ResponseEntity.ok(savedMatches);
    }
}
