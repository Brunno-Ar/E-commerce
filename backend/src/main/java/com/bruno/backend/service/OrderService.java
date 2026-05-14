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

import com.bruno.backend.repository.UserRepository;
import com.bruno.backend.entity.User;
import com.bruno.backend.entity.Address;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Long createOrder(OrderDTO dto) {
        Order order = new Order();
        order.setDateTime(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));
        order.setUser(user);

        if (dto.getShippingAddress() != null) {
            OrderDTO.AddressDTO addrDto = dto.getShippingAddress();
            com.bruno.backend.entity.ShippingAddress address = new com.bruno.backend.entity.ShippingAddress();
            address.setZipCode(addrDto.getZipCode());
            address.setStreet(addrDto.getStreet());
            address.setNumber(addrDto.getNumber());
            address.setComplement(addrDto.getComplement());
            address.setNeighborhood(addrDto.getNeighborhood());
            address.setCity(addrDto.getCity());
            address.setState(addrDto.getState());
            order.setShippingAddress(address);
        }

        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        if (dto.getItems() != null) {
            for (OrderDTO.OrderItemDTO itemDto : dto.getItems()) {
                Product product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getProductId()));

                int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                if (currentStock < itemDto.getQuantity()) {
                    throw new RuntimeException("Estoque insuficiente para o produto: " + product.getName()
                            + ". Disponível: " + currentStock + ", Solicitado: " + itemDto.getQuantity());
                }
                product.setStockQuantity(currentStock - itemDto.getQuantity());
                productRepository.save(product);

                BigDecimal price = product.getPrice();
                BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(itemDto.getQuantity()));

                totalValue = totalValue.add(itemTotal);

                OrderItem orderItem = new OrderItem(order, product, itemDto.getQuantity(), price);
                items.add(orderItem);
            }
        }

        order.setItems(items);
        order.setTotalValue(totalValue);

        Order savedOrder = orderRepository.save(order);
        return savedOrder.getId();
    }

    public List<Order> findUserOrders(String email) {
        return orderRepository.findByUserEmail(email);
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + id));
    }

    @Transactional
    public Order updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + orderId));

        OrderStatus currentStatus = order.getStatus();

        validateStatusTransition(currentStatus, newStatus);

        if (newStatus == OrderStatus.CANCELED && currentStatus != OrderStatus.CANCELED) {
            restoreStock(order);
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    private void validateStatusTransition(OrderStatus from, OrderStatus to) {
        if (from == OrderStatus.DELIVERED && to != OrderStatus.CANCELED) {
            throw new RuntimeException("Pedido já entregue não pode ter status alterado.");
        }
        if (from == OrderStatus.CANCELED) {
            throw new RuntimeException("Pedido cancelado não pode ter status alterado.");
        }
    }

    private void restoreStock(Order order) {
        List<Product> productsToUpdate = new ArrayList<>();
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            int currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            product.setStockQuantity(currentStock + item.getQuantity());
            productsToUpdate.add(product);
        }

        if (!productsToUpdate.isEmpty()) {
            productRepository.saveAll(productsToUpdate);
        }
    }
}
