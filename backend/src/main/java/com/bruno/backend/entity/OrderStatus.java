package com.bruno.backend.entity;

public enum OrderStatus {
    PENDING, // Aguardando pagamento
    PAID, // Pago
    PROCESSING, // Em processamento
    SHIPPED, // Enviado
    DELIVERED, // Entregue
    CANCELED // Cancelado
}
