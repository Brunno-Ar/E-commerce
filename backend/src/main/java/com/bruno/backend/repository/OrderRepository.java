package com.bruno.backend.repository;

import com.bruno.backend.entity.Order;
import com.bruno.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserEmail(String email);

    /**
     * Soma o valor total de todos os pedidos com status PAID.
     * Retorna 0 se não houver pedidos pagos.
     */
    @Query("SELECT COALESCE(SUM(o.totalValue), 0) FROM Order o WHERE o.status = 'PAID'")
    BigDecimal sumTotalRevenueFromPaidOrders();

    /**
     * Conta o total de pedidos (independente do status).
     */
    @Query("SELECT COUNT(o) FROM Order o")
    Long countAllOrders();
}
