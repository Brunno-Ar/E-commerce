package com.bruno.backend.controller;

import com.bruno.backend.dto.OrderDTO;
import com.bruno.backend.entity.Order;
import com.bruno.backend.repository.OrderRepository;
import com.bruno.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public ResponseEntity<Long> createOrder(@RequestBody OrderDTO dto) {
        Long orderId = orderService.createOrder(dto);
        return ResponseEntity.ok(orderId);
    }

    /**
     * Lista todos os pedidos (apenas para ADMIN).
     * Usado no Dashboard administrativo.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false, defaultValue = "100") int limit) {
        List<Order> orders = orderRepository.findAll();
        // Limita a quantidade de pedidos retornados
        if (orders.size() > limit) {
            orders = orders.subList(0, limit);
        }
        return ResponseEntity.ok(orders);
    }
}
