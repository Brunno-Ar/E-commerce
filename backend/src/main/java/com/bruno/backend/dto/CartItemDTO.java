package com.bruno.backend.dto;

import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long productId;
    private String title;
    private int quantity;
    private BigDecimal price;
    private boolean isAffiliate;
}
