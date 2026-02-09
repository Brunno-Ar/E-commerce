package com.bruno.backend.controller;

import com.bruno.backend.entity.Product;
import com.bruno.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ProductControllerBenchmarkTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ProductRepository productRepository;

    @Test
    public void benchmarkGetAll() {
        // Setup: Create many products
        int productCount = 1000;
        for (int i = 0; i < productCount; i++) {
            Product product = new Product();
            product.setName("Product " + i);
            product.setPrice(BigDecimal.valueOf(10.0));
            productRepository.save(product);
        }

        System.out.println("Starting benchmark with " + productCount + " products (Paginated)...");

        // Measure
        long startTime = System.nanoTime();
        // Fetch first page of 10 products
        ResponseEntity<Object> response = restTemplate.getForEntity("/api/products?page=0&size=10", Object.class);
        long endTime = System.nanoTime();

        double durationMs = (endTime - startTime) / 1_000_000.0;
        System.out.println("BENCHMARK_RESULT_AFTER: Execution time for first page (10/1000 products): " + durationMs + " ms");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
    }
}
