package com.bruno.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "affiliate_platforms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AffiliatePlatform {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affiliate_product_id")
    private AffiliateProduct affiliateProduct;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform_name", nullable = false)
    private PlatformName platformName;

    @Column(nullable = false)
    private String platformUrl;

    @Column(name = "affiliate_id")
    private String affiliateId;

    @Column(name = "current_price")
    private BigDecimal currentPrice;

    private Integer stock;

    @Column(nullable = false)
    private String currency = "BRL";

    @Column(name = "last_sync")
    private LocalDateTime lastSync;

    @Column(name = "tracking_params")
    private String trackingParams;

    @Column(name = "click_count")
    private Integer clickCount = 0;

    @Column(name = "conversion_count")
    private Integer conversionCount = 0;

    @Column(name = "commission_rate")
    private BigDecimal commissionRate;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    private void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    private void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void incrementClickCount() {
        this.clickCount++;
    }

    public void incrementConversionCount() {
        this.conversionCount++;
    }

    public boolean isInStock() {
        return stock != null && stock > 0;
    }

    public String getAffiliateUrl() {
        if (trackingParams != null && !trackingParams.isEmpty()) {
            return platformUrl + "?" + trackingParams;
        }
        return platformUrl;
    }
}