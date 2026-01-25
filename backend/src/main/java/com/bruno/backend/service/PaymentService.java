package com.bruno.backend.service;

import com.bruno.backend.dto.CartItemDTO;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    public String createPreference(List<CartItemDTO> cartItems) {
        try {
            // Placeholder Token as requested
            // No PaymentService.java
            MercadoPagoConfig
                    .setAccessToken("APP_USR-6431088389161370-012402-36483e989dce21fae1f9f2fdf73dd8be-2907827076");
            List<PreferenceItemRequest> items = new ArrayList<>();
            for (CartItemDTO item : cartItems) {
                // Security Rule: Filter affiliate items
                if (item.isAffiliate()) {
                    continue;
                }

                PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                        .title(item.getTitle())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getPrice())
                        .currencyId("BRL")
                        .build();
                items.add(itemRequest);
            }

            if (items.isEmpty()) {
                throw new RuntimeException("No valid native items for payment processing.");
            }

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:4200/checkout/callback")
                    .failure("http://localhost:4200/checkout/callback")
                    .pending("http://localhost:4200/checkout/callback")
                    .build();

            PreferenceRequest request = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(request);

            return preference.getInitPoint();

        } catch (Exception e) {
            throw new RuntimeException("Error creating payment preference", e);
        }
    }
}
