package com.bruno.backend.controller;

import com.bruno.backend.dto.DashboardStatsDTO;
import com.bruno.backend.repository.OrderRepository;
import com.bruno.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

/**
 * Controller para fornecer estatísticas do Dashboard administrativo.
 * Todos os endpoints requerem autenticação de ADMIN.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    /**
     * Retorna um resumo das estatísticas do negócio.
     * 
     * @return DashboardStatsDTO contendo:
     *         - totalRevenue: Valor total vendido (pedidos pagos)
     *         - totalOrders: Quantidade total de pedidos
     *         - totalProducts: Quantidade total de produtos
     *         - affiliateProducts: Quantidade de produtos afiliados
     *         - nativeProducts: Quantidade de produtos nativos
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        // Busca o total de receita (apenas pedidos pagos)
        BigDecimal totalRevenue = orderRepository.sumTotalRevenueFromPaidOrders();

        // Conta todos os pedidos
        Long totalOrders = orderRepository.countAllOrders();

        // Conta todos os produtos
        Long totalProducts = productRepository.count();

        // Conta produtos afiliados vs nativos
        Long affiliateProducts = productRepository.countAffiliateProducts();
        Long nativeProducts = productRepository.countNativeProducts();

        DashboardStatsDTO stats = new DashboardStatsDTO(
                totalRevenue,
                totalOrders,
                totalProducts,
                affiliateProducts,
                nativeProducts);

        return ResponseEntity.ok(stats);
    }
}
