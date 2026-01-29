package com.bruno.backend.controller;

import com.bruno.backend.dto.OrderDTO;
import com.bruno.backend.entity.Order;
import com.bruno.backend.entity.OrderStatus;
import com.bruno.backend.repository.OrderRepository;
import com.bruno.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    /**
     * Busca um pedido específico pelo ID (apenas ADMIN).
     * Retorna detalhes completos incluindo endereço e itens.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.findById(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Atualiza o status de um pedido (apenas ADMIN).
     * Usado para gerenciar o fluxo de entrega.
     * 
     * Body esperado: { "status": "SHIPPED" }
     * Valores possíveis: PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELED
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String statusStr = body.get("status");
            if (statusStr == null || statusStr.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Status é obrigatório"));
            }

            OrderStatus newStatus;
            try {
                newStatus = OrderStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Status inválido: " + statusStr,
                        "validStatuses", List.of("PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED")));
            }

            Order updatedOrder = orderService.updateStatus(id, newStatus);
            return ResponseEntity.ok(Map.of(
                    "message", "Status atualizado com sucesso",
                    "orderId", updatedOrder.getId(),
                    "newStatus", updatedOrder.getStatus().name()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()));
        }
    }
}
