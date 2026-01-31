package com.bruno.backend.service;

import com.bruno.backend.entity.Order;
import com.bruno.backend.entity.OrderItem;
import com.bruno.backend.entity.OrderStatus;
import com.bruno.backend.entity.Product;
import com.bruno.backend.repository.OrderRepository;
import com.bruno.backend.repository.ProductRepository;
import com.bruno.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    private Order order;
    private Product product1;
    private Product product2;

    @BeforeEach
    void setUp() {
        product1 = new Product();
        product1.setId(1L);
        product1.setAffiliate(false);
        product1.setStockQuantity(10);
        product1.setName("Product 1");
        product1.setPrice(java.math.BigDecimal.TEN);

        product2 = new Product();
        product2.setId(2L);
        product2.setAffiliate(false);
        product2.setStockQuantity(5);
        product2.setName("Product 2");
        product2.setPrice(java.math.BigDecimal.TEN);

        order = new Order();
        order.setId(100L);
        order.setStatus(OrderStatus.PENDING);

        OrderItem item1 = new OrderItem();
        item1.setProduct(product1);
        item1.setQuantity(2);
        item1.setOrder(order);

        OrderItem item2 = new OrderItem();
        item2.setProduct(product2);
        item2.setQuantity(3);
        item2.setOrder(order);

        order.setItems(Arrays.asList(item1, item2));
    }

    @Test
    void testUpdateStatus_Canceled_RestoresStock() {
        // Arrange
        Long orderId = 100L;
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Act
        orderService.updateStatus(orderId, OrderStatus.CANCELED);

        // Assert
        // New behavior: saveAll is called once with all products
        verify(productRepository, times(1)).saveAll(argThat(iterable -> {
            java.util.List<Product> list = new java.util.ArrayList<>();
            iterable.forEach(list::add);
            return list.contains(product1) && list.contains(product2) && list.size() == 2;
        }));
        verify(productRepository, never()).save(any(Product.class));

        // Ensure stock was updated in memory
        assertEquals(12, product1.getStockQuantity()); // 10 + 2
        assertEquals(8, product2.getStockQuantity());  // 5 + 3
    }
}
