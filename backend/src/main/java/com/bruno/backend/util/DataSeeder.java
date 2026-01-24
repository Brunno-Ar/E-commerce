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

                        Category furniture = new Category();
                        furniture.setName("Móveis");

                        categoryRepository.saveAll(List.of(electronics, books, furniture));

                        // Produtos Nativos (Venda Própria)
                        Product p1 = new Product(null, "Logitech MX Master 3S",
                                        "Mouse sem fio de alta precisão e ergonomia.",
                                        new BigDecimal("600.00"),
                                        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
                                        null, false, electronics);

                        Product p2 = new Product(null, "Keychron K2 V2", "Teclado mecânico sem fio com switch brown.",
                                        new BigDecimal("800.00"),
                                        "https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&w=800&q=80",
                                        null, false, electronics);

                        Product p3 = new Product(null, "Sony WH-1000XM5",
                                        "Fone de ouvido com cancelamento de ruído líder da indústria.",
                                        new BigDecimal("2200.00"),
                                        "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=800&q=80",
                                        null, false, electronics);

                        // Produtos Afiliados
                        Product p4 = new Product(null, "Monitor Dell Ultrasharp",
                                        "Monitor 4K USB-C Hub com cores precisas.",
                                        new BigDecimal("3500.00"),
                                        "https://images.unsplash.com/photo-1547959081-3606992d9f8e?auto=format&fit=crop&w=800&q=80",
                                        "https://amazon.com.br/monitor-dell", true, electronics);

                        Product p5 = new Product(null, "Cadeira Gamer Ergonômica",
                                        "Conforto máximo para longas sessões de jogo.",
                                        new BigDecimal("1500.00"),
                                        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80",
                                        "https://amazon.com.br/cadeira-gamer", true, furniture);

                        Product p6 = new Product(null, "MacBook Pro M2",
                                        "Potência extrema para profissionais criativos.",
                                        new BigDecimal("14000.00"),
                                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80",
                                        "https://amazon.com.br/macbook-pro", true, electronics);

                        productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6));

                        System.out.println("--- Data Seeder: Banco populado com sucesso! ---");
                }
        }
}
