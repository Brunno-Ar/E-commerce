package com.bruno.backend.controller;

import com.bruno.backend.dto.PlatformComparisonDTO;
import com.bruno.backend.service.AffiliateComparisonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/affiliate")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AffiliateController {

    private final AffiliateComparisonService affiliateComparisonService;

    @GetMapping("/compare/{productId}")
    public ResponseEntity<List<PlatformComparisonDTO>> compareProductPrices(@PathVariable Long productId) {
        List<PlatformComparisonDTO> comparisons = affiliateComparisonService.getPlatformComparisons(productId);
        return ResponseEntity.ok(comparisons);
    }

    @GetMapping("/best-price/{productId}")
    public ResponseEntity<PlatformComparisonDTO> getBestPrice(@PathVariable Long productId) {
        PlatformComparisonDTO bestPrice = affiliateComparisonService.getBestPricePlatform(productId);
        if (bestPrice != null) {
            return ResponseEntity.ok(bestPrice);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/click/{platformId}")
    public ResponseEntity<Void> recordClick(@PathVariable Long platformId) {
        affiliateComparisonService.incrementClickCount(platformId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/conversion/{platformId}")
    public ResponseEntity<Void> recordConversion(
            @PathVariable Long platformId,
            @RequestParam(required = false) BigDecimal commission) {
        affiliateComparisonService.recordConversion(platformId, commission);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/platform/{platformName}")
    public ResponseEntity<List<PlatformComparisonDTO>> getByPlatform(@PathVariable String platformName) {
        try {
            com.bruno.backend.entity.PlatformName platform = 
                com.bruno.backend.entity.PlatformName.valueOf(platformName.toUpperCase());
            List<PlatformComparisonDTO> comparisons = affiliateComparisonService.searchByPlatform(platform);
            return ResponseEntity.ok(comparisons);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}