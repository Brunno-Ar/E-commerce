package com.bruno.backend.dto;

import java.math.BigDecimal;

public record ProductRequest(
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        Long categoryId,
        String affiliateUrl,
        Boolean isAffiliate) {
}
