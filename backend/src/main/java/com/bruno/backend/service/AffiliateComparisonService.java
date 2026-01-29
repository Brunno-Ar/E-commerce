package com.bruno.backend.service;

import com.bruno.backend.dto.PlatformComparisonDTO;
import com.bruno.backend.entity.AffiliatePlatform;
import com.bruno.backend.entity.AffiliateProduct;
import com.bruno.backend.entity.PlatformName;
import com.bruno.backend.entity.Product;
import com.bruno.backend.repository.AffiliatePlatformRepository;
import com.bruno.backend.repository.AffiliateProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AffiliateComparisonService {

    private final AffiliatePlatformRepository affiliatePlatformRepository;
    private final AffiliateProductRepository affiliateProductRepository;

    public List<PlatformComparisonDTO> getPlatformComparisons(Long productId) {
        List<AffiliateProduct> affiliateProducts = affiliateProductRepository.findByProductId(productId);
        AffiliateProduct affiliateProduct = affiliateProducts.isEmpty() ? null : affiliateProducts.get(0);

        if (affiliateProduct == null || !affiliateProduct.isEnableComparison()) {
            return new ArrayList<>();
        }

        List<AffiliatePlatform> platforms = affiliatePlatformRepository
                .findByAffiliateProductIdAndIsActiveTrue(affiliateProduct.getId());

        return platforms.stream()
                .map(this::toComparisonDTO)
                .sorted(Comparator.comparing(PlatformComparisonDTO::getCurrentPrice))
                .collect(Collectors.toList());
    }

    public PlatformComparisonDTO getBestPricePlatform(Long productId) {
        List<PlatformComparisonDTO> comparisons = getPlatformComparisons(productId);
        return comparisons.stream()
                .filter(PlatformComparisonDTO::isInStock)
                .min(Comparator.comparing(PlatformComparisonDTO::getCurrentPrice))
                .orElse(null);
    }

    public void updatePlatformPrice(Long platformId, BigDecimal newPrice, Integer stock) {
        AffiliatePlatform platform = affiliatePlatformRepository.findById(platformId)
                .orElseThrow(() -> new RuntimeException("Plataforma não encontrada"));

        platform.setCurrentPrice(newPrice);
        platform.setStock(stock);
        platform.setLastSync(LocalDateTime.now());

        affiliatePlatformRepository.save(platform);

        // Update best price for the affiliate product
        updateBestPrice(platform.getAffiliateProduct());
    }

    public void incrementClickCount(Long platformId) {
        AffiliatePlatform platform = affiliatePlatformRepository.findById(platformId)
                .orElseThrow(() -> new RuntimeException("Plataforma não encontrada"));

        platform.incrementClickCount();
        affiliatePlatformRepository.save(platform);

        // Update click count on affiliate product
        if (platform.getAffiliateProduct() != null) {
            platform.getAffiliateProduct().incrementClickCount();
            affiliateProductRepository.save(platform.getAffiliateProduct());
        }
    }

    public void recordConversion(Long platformId, BigDecimal commission) {
        AffiliatePlatform platform = affiliatePlatformRepository.findById(platformId)
                .orElseThrow(() -> new RuntimeException("Plataforma não encontrada"));

        platform.incrementConversionCount();
        affiliatePlatformRepository.save(platform);

        // Update conversion and commission on affiliate product
        if (platform.getAffiliateProduct() != null) {
            platform.getAffiliateProduct().incrementConversionCount(commission);
            affiliateProductRepository.save(platform.getAffiliateProduct());
        }
    }

    public List<PlatformComparisonDTO> searchByPlatform(PlatformName platformName) {
        List<AffiliatePlatform> platforms = affiliatePlatformRepository.findByPlatformName(platformName);
        return platforms.stream()
                .filter(AffiliatePlatform::isActive)
                .map(this::toComparisonDTO)
                .collect(Collectors.toList());
    }

    private void updateBestPrice(AffiliateProduct affiliateProduct) {
        List<AffiliatePlatform> platforms = affiliatePlatformRepository
                .findByAffiliateProductAndIsActiveTrue(affiliateProduct);

        AffiliatePlatform bestPlatform = platforms.stream()
                .filter(AffiliatePlatform::isInStock)
                .min(Comparator.comparing(AffiliatePlatform::getCurrentPrice))
                .orElse(null);

        if (bestPlatform != null) {
            affiliateProduct.setBestPrice(bestPlatform.getCurrentPrice());
            affiliateProduct.setBestPlatform(bestPlatform.getPlatformName().name());
        } else {
            affiliateProduct.setBestPrice(null);
            affiliateProduct.setBestPlatform(null);
        }

        affiliateProduct.setLastPriceCheck(LocalDateTime.now());
        affiliateProductRepository.save(affiliateProduct);
    }

    private PlatformComparisonDTO toComparisonDTO(AffiliatePlatform platform) {
        PlatformComparisonDTO dto = new PlatformComparisonDTO();
        dto.setId(platform.getId());
        dto.setPlatformName(platform.getPlatformName());
        dto.setPlatformUrl(platform.getPlatformUrl());
        dto.setCurrentPrice(platform.getCurrentPrice());
        dto.setStock(platform.getStock());
        dto.setCurrency(platform.getCurrency());
        dto.setLogoUrl(platform.getLogoUrl());
        dto.setDisplayName(platform.getDisplayName());
        dto.setAffiliateUrl(platform.getAffiliateUrl());
        dto.setTrackingParams(platform.getTrackingParams());
        dto.setLastSync(platform.getLastSync());
        dto.setInStock(platform.isInStock());

        // Calculate if this is the best price
        if (platform.getAffiliateProduct() != null) {
            BigDecimal bestPrice = platform.getAffiliateProduct().getBestPrice();
            dto.setBestPrice(bestPrice != null &&
                    platform.getCurrentPrice().compareTo(bestPrice) == 0);
        }

        // Default values for now - these would come from additional integrations
        dto.setShippingCost(BigDecimal.ZERO);
        dto.setDeliveryDays(7);
        dto.setRating(4.5);
        dto.setReviewCount(100);
        dto.setHasFreeShipping(false);
        dto.setHasDiscount(false);
        dto.setDiscountPercentage(BigDecimal.ZERO);

        return dto;
    }

    public AffiliatePlatform createPlatform(AffiliateProduct affiliateProduct,
            PlatformName platformName,
            String platformUrl,
            String displayName) {
        AffiliatePlatform platform = new AffiliatePlatform();
        platform.setAffiliateProduct(affiliateProduct);
        platform.setPlatformName(platformName);
        platform.setPlatformUrl(platformUrl);
        platform.setDisplayName(displayName != null ? displayName : platformName.name());
        platform.setCurrency("BRL");
        platform.setActive(true);

        return affiliatePlatformRepository.save(platform);
    }
}