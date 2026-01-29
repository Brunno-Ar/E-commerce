package com.bruno.backend.dto;

import com.bruno.backend.entity.PlatformName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlatformComparisonDTO {
    private Long id;
    private PlatformName platformName;
    private String platformUrl;
    private BigDecimal currentPrice;
    private Integer stock;
    private String currency;
    private String logoUrl;
    private String displayName;
    private boolean isBestPrice;
    private boolean isInStock;
    private String affiliateUrl;
    private String trackingParams;
    private LocalDateTime lastSync;
    
    // Additional comparison data
    private BigDecimal shippingCost;
    private Integer deliveryDays;
    private Double rating;
    private Integer reviewCount;
    private boolean hasFreeShipping;
    private boolean hasDiscount;
    private BigDecimal discountPercentage;
}