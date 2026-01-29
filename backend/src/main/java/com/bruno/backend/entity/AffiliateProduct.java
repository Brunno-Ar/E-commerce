package com.bruno.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "affiliate_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AffiliateProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @OneToMany(mappedBy = "affiliateProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AffiliatePlatform> platforms = new ArrayList<>();

    @Column(name = "custom_slug")
    private String customSlug;

    @Column(name = "enable_comparison")
    private boolean enableComparison = true;

    @Column(name = "best_price")
    private BigDecimal bestPrice;

    @Column(name = "best_platform")
    private String bestPlatform;

    @Column(name = "last_price_check")
    private LocalDateTime lastPriceCheck;

    @Column(name = "click_count")
    private Integer clickCount = 0;

    @Column(name = "conversion_count")
    private Integer conversionCount = 0;

    @Column(name = "total_commission")
    private BigDecimal totalCommission = BigDecimal.ZERO;

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

    public void incrementConversionCount(BigDecimal commission) {
        this.conversionCount++;
        if (commission != null) {
            this.totalCommission = this.totalCommission.add(commission);
        }
    }
}