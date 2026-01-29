package com.bruno.backend.dto;

import com.bruno.backend.entity.PlatformName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AffiliatePlatformDTO {
    private Long id;

    @NotNull(message = "Plataforma é obrigatória")
    private PlatformName platformName;

    @NotBlank(message = "URL da plataforma é obrigatória")
    private String platformUrl;

    private String affiliateId;

    private BigDecimal currentPrice;

    private Integer stock;

    private String currency = "BRL";

    private String trackingParams;

    private BigDecimal commissionRate;

    private String logoUrl;

    private String displayName;

    private boolean isActive = true;
}