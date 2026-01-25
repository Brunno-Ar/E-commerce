package com.bruno.backend.controller;

import com.bruno.backend.dto.CartItemDTO;
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

    @PostMapping("/process")
    public ResponseEntity<Map<String, String>> processCheckout(@RequestBody List<CartItemDTO> cartItems) {
        String paymentUrl = paymentService.createPreference(cartItems);
        return ResponseEntity.ok(Map.of("url", paymentUrl));
    }
}
