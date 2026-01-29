package com.bruno.backend.controller;

import com.bruno.backend.dto.CartItemDTO;
import com.bruno.backend.dto.OrderDTO;
import com.bruno.backend.entity.Order;
import com.bruno.backend.repository.OrderRepository;
import com.bruno.backend.service.OrderService;
import com.bruno.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping("/process")
    public ResponseEntity<Map<String, String>> processCheckout(@RequestBody OrderDTO orderDTO) {
        // 1. Salvar o Pedido (com endereço e usuário vinculado)
        Long orderId = orderService.createOrder(orderDTO);

        // 2. Recuperar o pedido salvo para garantir dados confiáveis (preço, nome)
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 3. Converter para DTO do Pagamento
        List<CartItemDTO> cartItems = order.getItems().stream().map(item -> {
            CartItemDTO dto = new CartItemDTO();
            dto.setProductId(item.getProduct().getId());
            dto.setTitle(item.getProduct().getName());
            dto.setQuantity(item.getQuantity());
            dto.setPrice(item.getPriceAtPurchase());
            dto.setAffiliate(item.getProduct().isAffiliate()); // Assumindo getter
            return dto;
        }).toList();

        // 4. Gerar Link de Pagamento
        String paymentUrl = paymentService.createPreference(cartItems);

        return ResponseEntity.ok(Map.of("url", paymentUrl));
    }
}
