package com.bruno.backend.service;

import com.bruno.backend.dto.OrderDTO;
import com.bruno.backend.entity.Order;
import com.bruno.backend.entity.OrderItem;
import com.bruno.backend.entity.OrderStatus;
import com.bruno.backend.entity.Product;
import com.bruno.backend.repository.OrderRepository;
import com.bruno.backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Long createOrder(OrderDTO dto) {
        Order order = new Order();
        order.setDateTime(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        for (OrderDTO.OrderItemDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getProductId()));

            BigDecimal price = product.getPrice();
            BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            totalValue = totalValue.add(itemTotal);

            OrderItem orderItem = new OrderItem(order, product, itemDto.getQuantity(), price);
            items.add(orderItem);
        }

        order.setItems(items);
        order.setTotalValue(totalValue);

        Order savedOrder = orderRepository.save(order);
        return savedOrder.getId();
    }
}
