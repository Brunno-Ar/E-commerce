package com.bruno.backend.util;

import com.bruno.backend.entity.Category;
import com.bruno.backend.entity.Product;
import com.bruno.backend.repository.CategoryRepository;
import com.bruno.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            Category electronics = new Category();
            electronics.setName("Eletrônicos");

            Category books = new Category();
            books.setName("Livros");

            categoryRepository.saveAll(List.of(electronics, books));

            Product p1 = new Product(null, "Smartphone XYZ", "Melhor celular do ano", new BigDecimal("2500.00"),
                    "https://placehold.co/200", electronics);
            Product p2 = new Product(null, "Notebook Gamer", "Placa de vídeo potente", new BigDecimal("5500.00"),
                    "https://placehold.co/200", electronics);
            Product p3 = new Product(null, "Fone Bluetooth", "Cancelamento de ruído", new BigDecimal("300.00"),
                    "https://placehold.co/200", electronics);
            Product p4 = new Product(null, "Clean Code", "Livro essencial", new BigDecimal("80.00"),
                    "https://placehold.co/200", books);
            Product p5 = new Product(null, "Arquitetura Limpa", "Livro do Uncle Bob", new BigDecimal("90.00"),
                    "https://placehold.co/200", books);

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5));

            System.out.println("--- Data Seeder: Banco populado com sucesso! ---");
        }
    }
}
