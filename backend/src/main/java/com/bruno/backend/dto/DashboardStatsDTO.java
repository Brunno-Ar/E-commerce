package com.bruno.backend.dto;

import java.math.BigDecimal;

/**
 * DTO para transportar estatísticas do Dashboard administrativo.
 */
public record DashboardStatsDTO(
        BigDecimal totalRevenue, // Valor total vendido (pedidos pagos)
        Long totalOrders, // Quantidade total de pedidos
        Long totalProducts, // Quantidade total de produtos
        Long affiliateProducts, // Quantidade de produtos afiliados
        Long nativeProducts // Quantidade de produtos nativos (venda própria)
) {
}
