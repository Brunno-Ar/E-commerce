package com.bruno.backend.controller;

import com.bruno.backend.dto.OrderDTO;
import com.bruno.backend.entity.Order;
import com.bruno.backend.repository.OrderRepository;
import com.bruno.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    /**
     * Cria um novo pedido (usuário autenticado).
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO dto) {
        try {
            Long orderId = orderService.createOrder(dto);
            return ResponseEntity.ok(Map.of(
                    "orderId", orderId,
                    "message", "Pedido criado com sucesso"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()));
        }
    }

    /**
     * Lista os pedidos do usuário logado.
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        List<Order> orders = orderService.findUserOrders(principal.getName());
        return ResponseEntity.ok(orders);
    }
}
