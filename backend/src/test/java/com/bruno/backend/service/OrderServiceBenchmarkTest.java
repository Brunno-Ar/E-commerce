package com.bruno.backend.service;

import com.bruno.backend.dto.OrderDTO;
import com.bruno.backend.entity.Order;
import com.bruno.backend.entity.Product;
import com.bruno.backend.entity.User;
import com.bruno.backend.repository.OrderRepository;
import com.bruno.backend.repository.ProductRepository;
import com.bruno.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceBenchmarkTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@example.com");

        User user = new User();
        user.setEmail("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void benchmarkCreateOrder() {
        int productCount = 100;
        OrderDTO dto = new OrderDTO();
        List<OrderDTO.OrderItemDTO> items = new ArrayList<>();

        for (long i = 1; i <= productCount; i++) {
            Product product = new Product();
            product.setId(i);
            product.setName("Product " + i);
            product.setPrice(BigDecimal.TEN);
            product.setStockQuantity(1000);
            product.setAffiliate(false);

            when(productRepository.findById(i)).thenReturn(Optional.of(product));

            OrderDTO.OrderItemDTO itemDto = new OrderDTO.OrderItemDTO();
            itemDto.setProductId(i);
            itemDto.setQuantity(1);
            items.add(itemDto);
        }
        dto.setItems(items);

        // Warm up
        for (int i = 0; i < 5; i++) {
            orderService.createOrder(dto);
        }

        long startTime = System.nanoTime();
        orderService.createOrder(dto);
        long endTime = System.nanoTime();

        double durationMs = (endTime - startTime) / 1_000_000.0;
        System.out.println("BENCHMARK_RESULT: Execution time: " + durationMs + " ms");
    }
}
